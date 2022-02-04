import { defineConfig } from "vite";
import marko from "@marko/vite";

import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import {md2Marko} from './md2marko';

export default defineConfig({
  plugins: [
    viteCommonjs(),
    marko(),
    md2Marko(),
  ],
  build: {
    outDir: "dist", // Server and client builds should output assets to the same folder.
    emptyOutDir: false // Avoid server / client deleting files from each other.
  }
});
