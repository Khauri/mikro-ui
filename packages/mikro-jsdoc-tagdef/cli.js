#!/usr/bin/env node
import {program} from 'commander';
import {convertFiles} from './index.js';

program.argument('[files...]', 'Glob patterns or list of to match files to convert')
  .option('-i, --tag-ignore <file>', 'File containing a list of glob patterns to ignore')
  .option('-d, --dry-run', 'Output changes to console instead of writing to a file')
  .option('-v, --verbosity <level>', 'Level of verbosity', 0)
  .parse();

const {tagIgnore = '.tagignore', dryRun, verbosity} = program.opts();

const files = program.args.length ? program.args : ['**/*.marko', '**/*.component.js', '!**/node_modules/**'];

convertFiles(files, {ignoreFiles: tagIgnore, write: !dryRun, verbosity});
