// Outputs css
import hash from './utils/hash';
import {getThemeValueRecursively} from './utils';
import {properties} from '../definitions';

const cache = {};

function sortEntriesByKey(entry1, entry2) {
  return entry1[0].localeCompare(entry2[0]);
}

function resolve(value, property, theme) {
  // Determining when to use css variables vs when use classes should be more sophisticated than this probably
  let resolvedValue = value;
  if(typeof value === 'string' && property.theme) {
    resolvedValue = `var(--mikro-${property.theme}-${value})`;
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