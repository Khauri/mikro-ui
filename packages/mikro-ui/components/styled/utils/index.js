import hash from './hash';
import color from './color';
import space from './space';
import layout from './layout';
import flexbox from './flexbox';
import typography from './typography';

import defaultTheme from '../../../theme'; // temp

const properties = {
  ...space,
  ...layout,
  ...flexbox,
  ...color,
  ...typography,
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
        return `${property}: ${value};`;
      }
      // TODO: if value starts with colors, fonts, fontSizes, etc, resolve that first
      if(typeof theme[prop.theme] === 'object' && typeof value === 'string') {
        // TODO: json-path-ish
        value = getDeep(value, theme[prop.theme]);
      }
      if(theme[prop.theme]?.[value]) {
        return `${property}: var(--mikro-${prop.theme}-${value});`
      }
      return `${property}: ${value};`
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
}) {
  input = {
    ...theme.components[component]?.baseStyle,
    ...theme.components[component]?.variants?.[variant],
    ...theme.layerStyles?.[layerStyle],
    ...input,
  }
  const attrs = {};
  let css = '';
  // Separate styled keys from other attrs
  for(const key in input) {
    if(!properties[key]) {
      attrs[key] = input[key];
    } else {
      const prop = properties[key];
      // TODO: Handle responsivenes
      css += resolve(prop, input[key], theme);
    }
  }
  // TODO: Sort keys before hashing
  const classname = hash(css);
  css = `.css-${classname} {${css}}`;
  return {attrs, css, classname};
}
