import remark from 'remark';
import remarkMikro from 'remark-mikro';
import path from 'path';


export default function markdownToMarkoPlugin() {
  const virtualFiles = new Map();
  const QUERY = `?md=marko`;
  const parser = remark().use(remarkMikro);

  /** @type {import('vite').ModuleNode} */
  return {
    name: 'markdown-marko',
    enforce: 'pre',
    async handleHotUpdate(ctx) {
      try {
        const id = `${ctx.file}.marko`;
        if(!virtualFiles.has(id)) {
          return null;
        }
        const source = await ctx.read();
        const vfile = await parser.process(source);
        const [updated] = ctx.modules[0].importedModules;
        virtualFiles.set(id, vfile.contents);
        return [updated];
      } catch(err) {
        console.error(err);
      }
    },

    // Takes in a raw id and tries to resolve it to an absolute id.
    // to the end of the id so that we know to transform it in the transform step.
    resolveId(id, importer) {
      if(id.endsWith('.md.marko')) {
        let resolved;
        if(importer.endsWith('.md')) {
          resolved = `${importer}.marko`;
        } else {
          // in ssr mode the id is relative to the project root
          resolved = path.join(path.dirname(importer), id);
        }
        return resolved;
      }
      return null;
    },

    // Loads the marko file that was generated in the transform step. Since the marko file has a .marko extension
    // the marko loader will take over using the code we provide as the source as if it were an actual file.
    async load(id) {
      if(virtualFiles.has(id)) {
        return virtualFiles.get(id) || null;
      }
    },

    // When the id ends with .md we know that it is a markdown file that needs to be transformed
    // We store the result in a virtual file map so that we can load it later.
    async transform(source, id) {
      if(!id.endsWith('.md')) {
        return null;
      }
      let url = `${id}.marko`;
      const vfile = await parser.process(source);
      virtualFiles.set(url, vfile.contents);
      return {code: `export {default} from "${url}";`};
    }
  }
}
