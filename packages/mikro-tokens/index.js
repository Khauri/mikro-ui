const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const {tmpdir} = require('os');
const jsonToScss = require('json-to-scss');

// Is cleaning the temp files necessary or will the filestystem delete them automatically?
function temp(ext) {
  return path.join(tmpdir(),`archive.${crypto.randomBytes(16).readUIntLE(0,6).toString(36)}.${ext}`);
}

async function fromObject(obj) {
  const input = temp('json');
  const json = JSON.stringify(obj);
  await fs.writeFile(input, json);

  const output = temp('scss');
  // tbh I could do this manually instead of using the json-to-scss package
  // which would save on having to write to temporary files
  jsonToScss(
    [input], 
    [output],
    '$theme-tokens: ',
    ';',
    undefined,
    undefined,
    1,
    undefined,
    false,
    false,
    false,
    undefined,
    undefined,
    '',
    false,
    undefined,
  ); // could probably just do this manually tbh
  const result = await fs.readFile(output);

  // Clean up temp files?
  fs.unlink(input);
  fs.unlink(output);
  return result;
}

module.exports = {fromObject};
