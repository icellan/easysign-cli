#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/yargs';
import { showHashInfo, showHashInfoOfFile } from './easysign';

const options = yargs(hideBin(process.argv))
  .usage('Usage: -h <file hash> | -f <local file name>')
  .option('h', {
    alias: 'hash',
    describe: 'File hash of the file you want to check on the blockchain',
    type: 'string',
  })
  .option('f', {
    alias: 'fileName',
    describe: 'Name of the file on your local file system that you want to check on the blockchain',
    type: 'string',
  })
  .option('j', {
    alias: 'json',
    describe: 'Whether to return only the raw JSON string (without formatting)',
    type: 'boolean',
  })
  .argv;

(async () => {
  if (options.hash) {
    await showHashInfo(options.hash, options.json);
  } else if (options.fileName) {
    await showHashInfoOfFile(options.fileName, options.json);
  } else {
    console.log('Usage: easysign-cli -h <file hash> | -f <local file name>');
  }
})()
  .catch((error) => {
    console.error(error);
  });
