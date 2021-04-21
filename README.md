# easysign-cli
> A CLI helper application to get and verify [EasySign.io](https://easysign.io/) hashes

Timestamping files on the BSV blockchain

For support: https://twitter.com/EasySign_io

## Usage

Install easysign-cli

```
npm i -g easysign-cli
export PLANARIA_TOKEN="<your planaria token>"
```

Check for a timestamp of a file

```
easysign-cli -f <file name>
```

Check for a timestamp of a known file hash

```
easysign-cli -h <file hash>
```

You can also add the `-j` option to return a JSON string for further processing.

```
easysign-cli -f <file name> -j
```

## Hashing a file on a computer
- OSX: openssl dgst -sha256 <file>
- Linux: sha256sum <file>

## Using this in a nodejs project

Install in project

```
npm i easysign-cli
```

Use any of the functions:

```JavaScript
// get a Planaria token and either define it in your env in PLANARIA_TOKEN or set a global
global.PLANARIA_TOKEN = "<your planaria token>";
import { getHashInfo, getFileHash, retrieveData, decrypt } from 'easysign-cli';

const hash = '<fileHash>';
const info = await getHashInfo(hash);
// or
const hash = await getFileHash('<file name>');
const info = await getHashInfo(hash);
// or
const txData = await retrieveData(hash);
// or
// not an async function
const info = decrypt(hash, '<encrypted data from tx>');
```
