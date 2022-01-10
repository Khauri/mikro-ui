import fs from 'fs';
import path from 'path';
import {Router} from "express";
import {fileURLToPath} from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = new Router();

const root = path.join(__dirname, 'pages');

const types = {
  'md': {},
  // use 'require' for Marko because it relies on some cjs stuff. This may or may not cause issues tbh.
  'marko': {}
}

// Determine if a file is a component (as opposed to a page)
function isComponent(file) {
  return file.includes('/components/');
}

// Adds a page to the router given its filepath
async function addRoute(file) {
  if(isComponent(file)) {
    return;
  }
  const relPath = path.relative(root, file);
  const pageBase = `${path.dirname(relPath).replace(/^\./, '')}`;
  let pageName = path.basename(file).replace(/\..+$/, '');
  if(pageName === 'index') {
    pageName = '';
  }
  const route = `/${pageBase}${pageName ? `/${pageName}` : ''}`;
  const ext = path.extname(file).slice(1);
  if(!types[ext]) {
    return;
  }
  const page = await import(file);
  pages.get(route, (req, res) => res.marko(page.default || page, {}));
}

// walk the pages directory and add each page to the router
function walk(dir, router){
  const promises = fs.readdirSync(dir).map(async file => {
    const path = dir + '/' + file;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      walk(path, router);
      return;
    }
    await addRoute(path);
  });
  return Promise.all(promises);
};

await walk(path.join(__dirname, 'pages'), pages);

export default pages;