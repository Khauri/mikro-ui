import fs from 'node:fs';
import path from 'node:path';
import {globby} from 'globby';
import jsdocAPI from 'jsdoc-api';

const multiLineCommentRegex = /(\/\*\*.+?\*\/)/gs; // There's no point in overcomplicating this

const attTypeMap = {
  String: 'string',
  Boolean: 'boolean',
  Number: 'number',
  Object: 'object',
  Function: 'function',
  Array: 'array',
  RegExp: 'regexp',
  Date: 'date',
  any: 'expression',
};

export function analyzeText(text, markoJson = {}) {
  const comments = text.match(multiLineCommentRegex);
  const tagComment = comments.find(comment => /@(tag|component)/g.test(comment));
  // In order for jsdocAPI to work the doc has to be attached to some js object
  const source = `${tagComment}\nexport default {}`;
  const [parsed] = jsdocAPI.explainSync({source});
  
  markoJson.attributes = markoJson.attributes || {};
  if(parsed.examples?.length) {
    markoJson.autocomplete = parsed.examples.map((ex) => {
      let [description, ...snippet] = ex.split('\n');
      if(!snippet?.length) {
        snippet = [description];
        description = '';
      }
      snippet = snippet.map(line => line.replace(/\t/g, '  ')); // Replace tabs with 2 spaces
      const indentation = snippet.at(0).match(/^\s+/)?.[0] || '';
      snippet = snippet.map(line => (line.startsWith(indentation) ? line.slice(indentation.length) : line)).join('\n');
      return {
        displayText: snippet.replace(/\$(?:\d+|\{\d+(?::([^}]*?))?\})/g, (_, n) => (n ? `<${n}>` : '')).trim().replace(/\s+/g, ' '),
        description,
        snippet: snippet.replace(/^</, ''), // removes the first < if it exists
      };
    });
  }
  markoJson.description = markoJson.description ?? parsed.description;
  if(overwriteAttrs) {
    markoJson.attributes = {'*': {targetProperty: null}};
  }
  // parse the properties and mutate markoJson attributes
  parsed.properties?.forEach((property) => {
    const {name, type, description = '', optional = false, required = !optional} = property;
    const {names: typeNames} = type;
    if(!markoJson.attributes[name]) {
      markoJson.attributes[name] = {};
    }
    Object.assign(markoJson.attributes[name], {
      type: typeNames.map(typeName => attTypeMap[typeName] ?? typeName).join('|'),
      // ...typeof defaultvalue !== 'undefined' && {'default-value': defaultvalue},
      required,
      description,
    });
  });

  if(parsed.fires?.length) {
    parsed.fires.forEach((evt) => {
      const [, name, rest] = evt.match(/^event:([^\s]+)\s(.+)/) ?? [];
      if(!name) {
        return;
      }
      markoJson.attributes[`on-${name}`] = {
        type: 'expression',
        autocomplete: [
          {
            description: rest.replace(/^\s*-\s*/, ''),
            displayText: `on-${name}(...)`,
          },
        ],
      };
      const fnName = `on${name[0].toUpperCase()}${name.slice(1)}`;
      markoJson.attributes[fnName] = {
        type: 'function',
        autocomplete: [
          {
            description: rest.replace(/^\s*-\s*/, ''),
            displayText: `${fnName}( ...args ){ ... }`,
            snippet: `${fnName}($1){\n\t$0\n}`,
          },
        ],
      };
    });
  }
  return markoJson;
}

/**
 * @description Analyzes a single file and returns the metadata for the tag
 * @param {string} filePath
 * @param {object} options
 * @returns
 */
export async function analyzeFile(filePath, {overwriteAttrs = true}) {
  const {dir} = path.parse(filePath);

  const text = fs.readFileSync(filePath, 'utf8');
  if(!/@(tag|component)/g.test(text)) {
    return {metric: 'filesWithoutDefinitions'};
  }
  // Look for a marko.json file in the same directory as the file
  const markoJsonPath = path.join(dir, 'marko-tag.json');
  const hasMarkoJson = fs.existsSync(markoJsonPath);
  const markoJson = hasMarkoJson ? JSON.parse(fs.readFileSync(markoJsonPath, 'utf8')) : {};

  const result = await analyzeText(text, markoJson, {overwriteAttrs});

  return {outputPath: markoJsonPath, output: result, metric: hasMarkoJson ? 'filesModified' : 'filesCreated'};
}

/**
 * @description Parses a list of files and generates a JSON document for eaach
 * @param {string|string[]} patterns
 * @param {object} options
 * @param {string|string[]} [options.ignoreFiles] - Path(s) to one or more .ignore file (similar to .gitignore)
 * @param {boolean} [options.write=true] - Whether or not to write the output to a file
 * @param {boolean} [options.overwriteAttrs=false] - When true will remove existing attributes in the marko-tag.json file
 */
export async function convertFiles(patterns, {ignoreFiles, overwriteAttrs, verbosity = 0, write = true} = {}) {
  const metrics = {
    filesToAnalyze: 0,
    filesAnalyzed: 0,
    filesIneligible: 0, // files that can't be processed because they are not in a folder of the same name/not named index
    filesWithoutDefinitions: 0, // files that were not processed because they did not contain a tag or component jsdoc item
    filesModified: 0,
    filesCreated: 0,
  };
  let files = await globby(patterns, {ignoreFiles});
  metrics.filesToAnalyze = files.length;
  // prune files that
  files = files.filter((file) => {
    const {dir, name} = path.parse(file);
    const dirName = path.basename(dir);
    const nameCandidates = [
      dirName, // my-tag.marko
      'index', // index.marko
      'component', // component.js
      `${dirName}.component`, // my-tag.component.js
    ];
    if(!nameCandidates.includes(name)) {
      metrics.filesIneligible++;
      return false;
    }
    return true;
  });

  // Only analyze a few files at a time. In the future throw this in a worker
  const chunkSize = 10;
  while(files.length) {
    const chunk = files.splice(0, chunkSize);
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(chunk.map(async (file) => {
      const {metric, output, outputPath} = await analyzeFile(file, {overwriteAttrs});
      metrics[metric]++;
      if(!output) {
        return;
      }
      if(write) {
        await fs.promises.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8');
      } else {
        console.log(outputPath, output);
      }
    }));
  }
  if(!write) {
    console.log('Dry run complete. No files written to disk');
    if(verbosity <= 0) {
      console.log('Run with -v <level> to see additional metrics');
    }
  }
  if(verbosity >= 1) {
    console.table(metrics);
  }
}

export default convertFiles;
