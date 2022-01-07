import {definitions} from '../../definitions';

const definitionKeys = Object.keys(definitions);

// TODO: Support JSON-path syntax for more flexibility
export function getValueAtPath(key, obj) {
  if(!obj) {
    return undefined;
  }
  return key.split(/\./g).reduce((o, i) => o?.[i], obj);
}

export function getThemeValueRecursively(value, theme, prop, stack = []) {
  let root = theme?.[prop.theme]; // default root to theme's object
  if(typeof value === 'string') {
    const [firstEl] = value.split('.');
    const resolveTo = definitionKeys.find(key => key === firstEl);
    if(resolveTo) {
      root = theme?.[resolveTo];
    }
  }
  if(typeof root === 'object' && typeof value === 'string') {
    value = getValueAtPath(value, root) || value;
  }
  // Recurse if value references another theme value
  if(typeof value === 'string' && getValueAtPath(value, root) || getValueAtPath(value, theme)) {
    if(stack.includes(value)) {
      throw new Error(`Circular reference detected when resolving theme value. Path was: ${[...stack, value].join(' > ')}`);
    }
    return getThemeValueRecursively(value, theme, prop, [...stack, value]);
  }
  return value;
}
