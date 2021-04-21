import crypto from 'crypto';
import { ReadStream } from 'fs';
import fetch from 'node-fetch';
import sjcl from './sjcl';
import { PLANARIA_TOKEN, EASYSIGN_BITCOM_ADDRESS } from './config.js';

export const retrieveData = async function (hash) {
  if (!PLANARIA_TOKEN && !global.PLANARIA_TOKEN) {
    console.error('No Planaria token defined in config.json (https://token.planaria.network/)');
    process.exit(-1);
  }

  // the hashing is done twice before going on to the blockchain - on the string value
  const documentId = crypto.createHash('sha256')
    .update(hash)
    .digest('hex');
  const esyId = crypto.createHash('sha256')
    .update(documentId)
    .digest('hex');

  const query = {
    q: {
      find: {
        'out.s2': EASYSIGN_BITCOM_ADDRESS,
        'out.s3': esyId,
      },
      limit: 1,
    },
  };
  const response = await fetch('https://txo.bitbus.network/block', {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      token: PLANARIA_TOKEN || global.PLANARIA_TOKEN,
      format: 'json',
    },
    body: JSON.stringify(query),
  });

  return response.json();
};

const encryptionParams = {
  v: 1,
  iter: 1000,
  ks: 256,
  ts: 128,
  mode: 'ccm',
  adata: '',
  cipher: 'aes',
};

const decrypt = function (key, encryptedMessage) {
  key = sjcl.codec.hex.toBits(key);
  const keys = sjcl.ecc.elGamal.generateKeys(256, null, sjcl.bn.fromBits(key));

  encryptedMessage = JSON.parse(encryptedMessage);

  const params = sjcl.json._add({
    iv: encryptedMessage.iv,
    salt: encryptedMessage.salt,
    kemtag: encryptedMessage.kemtag,
    ct: encryptedMessage.ct,
  }, encryptionParams);

  return JSON.parse(sjcl.decrypt(keys.sec, JSON.stringify(params)));
};

export const getHashInfo = async function (hash) {
  const txs = await retrieveData(hash);

  if (txs[0] && txs[0].out && txs[0].out[0] && txs[0].out[0].s2 === EASYSIGN_BITCOM_ADDRESS) {
    let cipherText = txs[0].out[0].s4;
    if (!cipherText && txs[0].out[0].f4) {
      // bitbus has left the data in a file - need to retrieve the file
      const bitfsUrl = 'https://x.bitfs.network/' + txs[0].out[0].f4;
      const fileResponse = await fetch(bitfsUrl);
      cipherText = await fileResponse.text();
    }

    if (cipherText) {
      return {
        tx: txs[0].tx.h,
        block: txs[0].blk.i,
        meta: decrypt(hash, cipherText),
      };
    }
  }

  return false;
};

export const showHashInfo = async function (hash, jsonOnly = false) {
  const hashInfo = await getHashInfo(hash);
  if (hashInfo === false) {
    console.log('Transaction for this hash could not be found');
    return;
  }

  if (jsonOnly) {
    console.log(JSON.stringify(hashInfo));
  } else {
    console.log('Found EasySign.io info for file hash', hash);
    console.log(' - found in transaction', hashInfo.tx);
    console.log(' - found in block', hashInfo.block);
    console.log(hashInfo.meta);
  }
};

export const getFileHash = async function (fileName) {
  return new Promise((resolve, reject) => {
    const shaSum = crypto.createHash('sha256');
    try {
      const s = ReadStream(fileName);
      s.on('data', (data) => {
        shaSum.update(data);
      });

      // making digest
      s.on('end', () => {
        const hash = shaSum.digest('hex');
        resolve(hash);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const showHashInfoOfFile = async function (fileName, jsonOnly = false) {
  const hash = await getFileHash(fileName);
  await showHashInfo(hash, jsonOnly);
};
