import hash from './hash';
import color from './color';
import space from './space';
import layout from './layout';
import flexbox from './flexbox';
import typography from './typography';
import border from './border';

import defaultTheme from '../../../theme/index';

const cache = {};

const properties = {
  ...space,
  ...layout,
  ...flexbox,
  ...color,
  ...typography,
  ...border,
}

function getDeep(key, obj) {
  return key.split(/\./g).reduce((o, i) => o[i], obj);
}

function resolve(prop, value, theme) {
  // TODO: Support more than just a single value
  // const val = theme[prop.theme][value];
  return prop.properties
    .map(property => {
      if(prop.values) {
        return `${property}:${value};`;
      }
      // TODO: if value starts with colors, fonts, fontSizes, etc, resolve that first
      if(typeof theme?.[prop.theme] === 'object' && typeof value === 'string') {
        // TODO: json-path-ish
        value = getDeep(value, theme[prop.theme]) || value;
      }
      if(theme?.[prop.theme]?.[value]) {
        return `${property}:var(--mikro-${prop.theme}-${value});`
      }
      return `${property}:${value};`
    })
    .join('');
}

// Turn attrs into classes and return any unused attrs
export default function ({
  input, 
  component, 
  variant, 
  layerStyle,
  theme = defaultTheme,
  cache,
}) {
  // This seems to break on the client for some reason
  if(typeof theme === 'undefined') {
    console.warn('No theme defined. Why...')
    console.log(input, theme);
  }
  input = {
    ...theme?.components?.[component]?.baseStyle,
    ...theme?.components?.[component]?.variants?.[variant],
    ...theme?.layerStyles?.[layerStyle],
    ...input,
  }
  const attrs = {};
  // Separate styled keys from other attrs
  for(const key in input) {
    if(!properties[key]) {
      attrs[key] = input[key];
      delete input[key];
    }
  }
  const entries = Object.entries(input);
  const classname = hash(entries.sort((a,b) => a[0].localeCompare(b[0])).flat().join(';'));
  let css = cache[classname];
  if(!Object.entries(cache).length) {
    console.log("Cache Is EMPTY!")
  }
  if(!css) {
    css = entries.reduce((str, [key, value]) => str + resolve(properties[key], value, theme), '');
    cache[classname] = css;
  }
  // TODO: Sort keys before hashing
  css = `.css-${classname} {${css}}`;
  return {attrs, css, classname};
}
