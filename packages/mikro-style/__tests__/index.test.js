// Testing is pretty straightforward as this library has a single entrypoint.
// We simply load each fixture in the fixtures directory and apply snapshot testing.
// Be sure to update the snapshots when tests are changed.

import fs from 'fs';
import path from 'path';
import {expect} from 'chai';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {parse} from '../src/index.js';

const fixturesPath = path.join(__dirname, 'fixtures');

function* walk(dir) {
  for (const d of fs.readdirSync(dir, {withFileTypes: true})) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

// strips the extension from the file name and formats it a bit
function testNameFromFile(file) {
  const ext = path.extname(file);
  const testName = path.relative(fixturesPath, file).replace(new RegExp(`${ext}$`), '');
  return testName.replace(/[-_]/g, ' ').replace(/\//g, ' > ');
}

for (const file of walk(fixturesPath)) {
  const testName = testNameFromFile(file);
  it(testName, async () => {
    const test = await import(file);
    expect(parse(test.default)).to.matchSnapshot();
  });
}
