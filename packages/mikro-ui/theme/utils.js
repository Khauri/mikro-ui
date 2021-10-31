import merge from 'lodash.merge';
// Makes a css-safe name
export function makeCssSafe(value) {
  return value.replace(/\./g, '\\.')
}

function getThemeVariable(prefix, key, value) {
  const name = makeCssSafe(key);
  if(typeof value === 'string') {
    return `${prefix}-${name}: ${value};`
  }
  return Object.entries(value)
    .map(([k, v]) => getThemeVariable(`${prefix}-${name}`, k, v))
    .join('');
}

function isThemeValue(value) {
  return !/components/.test(value);
}

export function getThemeVariables(theme) {
  return Object.entries(theme)
    .filter(isThemeValue)
    .map(([type, values]) => getThemeVariable(`--mikro`, type, values))
    .join('');
}

export function mergeThemes(theme1, theme2) {
  if(!theme1) {
    return theme2;
  }
  if(!theme2) {
    return theme1;
  }
  if(theme1 === theme2) {
    return theme1;
  }
  // Please don't @ me about using lodash.
  return merge({}, theme1, theme2);
}