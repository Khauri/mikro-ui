const sass = require('sass');
const path = require('path');
const resolveFrom = require('resolve-from');

// Convert an object recursively
function toSassValue(v) {
  if(Array.isArray(v)) {
    const list = new sass.types.List(v.length, 'space');
    v.forEach((item, i) => {
      list.setValue(i, v.map(item));
    });
    return list;
  }
  if(typeof v === 'object' && v !== null) {
    const map = new sass.types.Map(Object.keys(v).length);
    Object.entries(v).forEach(([key, value], index) => {
      map.setKey(index, toSassValue(key));
      map.setValue(index, toSassValue(value));
    });
    return map;
  }

  if(typeof v === 'string') {
    return new sass.types.String(v);
  }

  if(typeof v === 'number') {
    return new sass.types.Number(v);
  }

  if(typeof v === 'boolean') {
    return new sass.types.Boolean(v);
  }

  return new sass.types.Null();
}

// Custom function to convert a js/json path into a SASS object
module.exports = function json(file) {
  if(!this.options) {
    return file;
  }
  let {file: cwd} = this.options; 
  const filePath = file.getValue();
  const dir = path.parse(cwd).dir;
  const resolvedPath = resolveFrom.silent(dir, filePath);
  let obj = require(resolvedPath);
  obj = obj.default || obj;
  const sassObj = toSassValue(obj);
  return sassObj;
};
