import fs from 'fs';
import path from 'path';
import {Router} from "express";
import {fileURLToPath} from 'url';
import template from './pages/docs/theming/index.md';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = new Router();

const root = path.join(__dirname, 'pages');

// The modules have to be pre-resolved or else hmr won't work at all.
const modules = import.meta.glob('./pages/**/*.{marko,md}');

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
function addRoute(file) {
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
  pages.get(route, async (req, res) => {
    const moduleId = `./pages/${relPath}`;
    const page = await (modules[moduleId]());
    res.marko(page.default || page, {})
  });
}

// walk the pages directory and add each page to the router
function walk(dir, router){
  fs.readdirSync(dir).forEach(file => {
    const path = dir + '/' + file;
    const stat = fs.statSync(path);
    if(stat.isDirectory()) {
      walk(path, router);
      return;
    }
    addRoute(path);
  });
};

walk(path.join(__dirname, 'pages'), pages);

pages.get('/test', (req, res) => { res.marko(template, {}) });

export default pages;