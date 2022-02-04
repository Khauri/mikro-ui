import remark from 'remark';
import remarkMikro from 'remark-mikro';
import fs from 'fs';

const parser = remark().use(remarkMikro);

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
        const vfile = await parser.process(source);
        fs.writeFileSync(id, vfile.contents);
        return null;
      } catch(err) {
        console.error(err);
      }
    },

    async transform(source, id, {ssr} = {}) {
      if(!id.endsWith('.md')) {
        return null;
      }
      let url = `${id}.marko`;
      const vfile = await parser.process(source);
      fs.writeFileSync(url, vfile.contents);
      return {code: `import template from "${url}"; export default template;`};
    }
  }
  return plugin;
}
