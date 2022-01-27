import { defineConfig } from "vite";
import marko from "@marko/vite";
import remark from 'remark';
import remarkMikro from 'remark-mikro';
import path from 'path';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

function markdownToMarkoPlugin() {
  const virtualFiles = new Map();
  const QUERY = `?md=marko`;
  const parser = remark().use(remarkMikro);
  return {
    name: 'markdown-marko',
    enforce: 'pre',
    // Takes in a raw id and tries to convert resolve it to an absoltue id. For raw `.md` files we add a query string
    // to the end of the id so that we know to transform it in the transform step.
    async resolveId(id, importer) {
      // If an md file, add a a prefix to it so that it can be transformed after being loaded
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
