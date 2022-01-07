// Outputs css
import hash from './utils/hash';
import {getThemeValueRecursively, getValueAtPath} from './utils';
import {properties} from '../definitions';

const cache = {};

function sortEntriesByKey(entry1, entry2) {
  return entry1[0].localeCompare(entry2[0]);
}

function isRawValue(v, values) {
  if(values?.includes(v)) {
    return true;
  }
  // Includes symbols or is a css number
  return /.*([\[\]\(\)#,\s]).*|\d+\s*(p[txp]|%|r?em|v[wh]|ex|vmax|vmin|in|[cm]m|ch)$/.test(v);
}

function resolve(value, property, theme) {
  // Determining when to use css variables vs raw value should be more sophisticated than this probably
  let resolvedValue;
  if(property.theme && getValueAtPath(value, theme[property.theme])) {
    resolvedValue = `var(--${property.theme}-${value})`.replace(/\./g, '-');
  } else {
    resolvedValue = getThemeValueRecursively(value, theme, property);
  }
  return property.properties.map(property => `${property}:${resolvedValue};`).join('');
}

function getRules(attrs, theme, cache) {
  const entries = Object.entries(attrs);
  const classname = hash(entries.sort(sortEntriesByKey).flat().join(';'));
  let css = cache[classname];
  if(!css) {
    // TODO: Breakpoints
    css = entries.reduce((str, [key, value]) => str + resolve(value, properties[key], theme), '');
    cache[classname] = css;
  }
  css = `.css-${classname} {${css}}`;
  return {css, classname};
}

export function parse(attrs, theme) {
  return getRules(attrs, theme, cache);
}