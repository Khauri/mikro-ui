// output inline styles
import {properties} from '../definitions';
import {getThemeValueRecursively} from './utils';

function resolve(prop, value, theme) {
  return prop.properties
    .map(property => {
      value = getThemeValueRecursively(value, theme, prop);
      // TODO: vendor prefixes
      return `${property}:${value};`
    }).join('');
}

function getStyles(attrs, theme) {
  // breakpoints do not work when in inline mode. Unsure if a warning or an error is better here.
  const entries = Object.entries(attrs);
  return entries.reduce((acc, [key, value]) => {
    const property = properties[key];
    acc += resolve(property, value, theme);
    return acc;
  },'');
}

export function parse(attrs, theme) {
  const styles = getStyles(attrs, theme);
  return {styles};
}