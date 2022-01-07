import {properties} from './definitions';

import * as modes from './modes';

import defaultTheme from '@mikro-ui/theme-default';

// Splits attributeds into used and unused
export function splitAttributes({
  input,
  component,
  variant,
  layerStyle,
  theme = defaultTheme,
}) {
  const unusedAttrs = {};
  const attrs = {
    ...theme?.components?.[component]?.baseStyle,
    ...theme?.components?.[component]?.variants?.[variant],
    ...theme?.layerStyles?.[layerStyle],
    ...input,
  }
   // Separate styled keys from other attrs
  for(const key in attrs) {
    if(properties[key]) {
      if(typeof attrs[key] === 'undefined' || attrs[key] === null) {
        delete attrs[key];
      }
    } else {
      unusedAttrs[key] = attrs[key];
      delete attrs[key];
    }
  }
  return {unusedAttrs, attrs};
}

// Turn attrs into classes and return any unused attrs
export function parse({
  input, 
  component, 
  variant, 
  layerStyle,
  theme = defaultTheme,
  mode = 'css',
} = {}) {
  if(typeof theme === 'undefined') {
    console.warn('No theme defined. Using default theme.');
  }
  const parser = modes[mode];
  if(!parser) {
    throw new Error(`Mode "${mode}" is not a valid mode. Must be one of ${Object.keys(modes).join(', ')}`);
  }
  const {unusedAttrs, attrs} = splitAttributes({input, component, variant, layerStyle, theme});
  const result = parser(attrs, theme);
  return {attrs: unusedAttrs, ...result};
}
