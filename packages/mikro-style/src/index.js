import hash from './definitions/hash';
import color from './definitions/color';
import space from './definitions/space';
import layout from './definitions/layout';
import flexbox from './definitions/flexbox';
import typography from './definitions/typography';
import border from './definitions/border';

import defaultTheme from 'mikro-theme-default';

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

function sortEntriesByKey(entry1, entry2) {
  return entry1[0].localeCompare(entry2[0]);
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
    }).join('');
}

function resolveValue(prop, value, theme) {
  if(!Array.isArray(value)) {
    value = [value];
  }
  return value.map(v => resolve(prop, v, theme));
}

function getBreakpointsFromTheme(theme) {
  const values = Object.values(theme.breakpoints);
  values.unshift('0em');
  return values;
}

function getRules(attrs, theme, cache) {
  const entries = Object.entries(attrs);
  const classname = hash(entries.sort(sortEntriesByKey).flat().join(';'));
  let css = cache[classname];
  if(!Object.entries(cache).length) {
    console.log("Cache Is EMPTY!")
  }
  if(!css) {
    css = entries.reduce((str, [key, value]) => str + resolve(properties[key], value, theme), '');
    // const breakpoints = getBreakpointsFromTheme(theme);
    // const rules = entries.map(([key, value]) => resolveValue(properties[key], value, theme));
    // rules[0]?.length > 1 && console.log(rules);
    cache[classname] = css;
  }
  css = `.css-${classname} {${css}}`;
  return {css, classname};
}

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
    if(!properties[key]) {
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
  cache,
}) {
  // This seems to break on the client for some reason
  if(typeof theme === 'undefined') {
    console.warn('No theme defined. Why...')
    console.log(input, theme);
  }
  const {unusedAttrs, attrs} = splitAttributes({input, component, variant, layerStyle, theme});
  const {css, classname} = getRules(attrs, theme, cache);
  return {attrs: unusedAttrs, css, classname};
}
