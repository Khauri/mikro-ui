import { defineConfig } from "vite";
import marko from "@marko/vite";
import remark from 'remark';
import remarkMikro from 'remark-mikro';
import path from 'path';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

const virtualFiles = new Map();
function markdownToMarkoPlugin() {
  const QUERY = `?md=marko`;
  const parser = remark().use(remarkMikro);

  /** @type {import('vite').ModuleNode} */
  return {
    name: 'markdown-marko',
    enforce: 'pre',
    // async handleHotUpdate(ctx) {
    //   try {
    //     const id = `${ctx.file}.marko`;
    //     const source = await ctx.read();
    //     const vfile = await parser.process(source);
    //     virtualFiles.set(id, vfile.contents);
    //     console.log(vfile.contents);
    //     const [updated] = ctx.modules[0].importedModules;
    //     return [updated];
    //   } catch(err) {
    //     console.error(err);
    //   }
    // },

    // Takes in a raw id and tries to convert resolve it to an absoltue id. For raw `.md` files we add a query string
    // to the end of the id so that we know to transform it in the transform step.
    async resolveId(id, importer) {
      if(id.endsWith('.md')) {
        return `${id}${QUERY}`;
      }
      if(id.endsWith('.md.marko')) {
        let resolved;
        if(importer.endsWith(QUERY)) {
          resolved = importer.replace(QUERY, '') + '.marko';
        } else {
          // in ssr mode the id is relative to the project root
          resolved = path.join(path.dirname(importer), id);
        }
        if(virtualFiles.has(resolved)) {
          return resolved;
        }
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

    // When the id ends with the a query string we know that it is a markdown file that needs to be transformed
    // We store the result in a virtual file map so that we can load it later.
    // We then insert code that imports a '.md.marko' file.
    async transform(source, id) {
      if(!id.endsWith(QUERY)) {
        return null;
      }
      id = id.replace(QUERY, '') + '.marko';
      const vfile = await parser.process(source);
      virtualFiles.set(id, vfile.contents);
      return {code: `export {default} from "${id}";`};
    }
  }
}

export default defineConfig({
  plugins: [
    viteCommonjs(),
    markdownToMarkoPlugin(),
    marko(),
  ],
  build: {
    outDir: "dist", // Server and client builds should output assets to the same folder.
    emptyOutDir: false // Avoid server / client deleting files from each other.
  }
});