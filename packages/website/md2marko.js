import remark from 'remark';
import remarkMikro from 'remark-mikro';
import fs from 'fs';

const parser = remark().use(remarkMikro);

async function parseAndWrite(id, source) {
  const {contents: result} = await parser.process(source);
  // Don't overwrite if result hasn't changed. Can probably do this in memory so it's quicker
  if(fs.existsSync(id)) {
    const oldResult = fs.readFileSync(id);
    if(oldResult === result) {
      return;
    }
  }
  fs.writeFileSync(id, result);
}

// This plugin must be placed after the marko plugin.
// Currently I've had to write the file to disk because marko can't read virtual files.
export function md2Marko() {
  /** @type {import('vite').Plugin} */
  const plugin = {
    name: 'markdown-marko',
    enforce: 'pre',

    async handleHotUpdate(ctx) {
      try {
        if(!ctx.file.endsWith('.md')) {
          return;
        }
        const id = `${ctx.file}.marko`;
        const source = await ctx.read();
        await parseAndWrite(id, source);
        return null;
      } catch(err) {
        console.error(err);
      }
    },

    async transform(source, id) {
      if(!id.endsWith('.md')) {
        return null;
      }
      let url = `${id}.marko`;
      await parseAndWrite(url, source);
      return {code: `import template from "${url}"; export default template;`};
    }
  }
  return plugin;
}
