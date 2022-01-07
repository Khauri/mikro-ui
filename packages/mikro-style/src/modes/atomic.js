// outputs atomic css classnames
const defaultMap = {
  display: 'd',
  'margin-x': 'mx',
  'margin-y': 'my',
};

function getClassname(attr, value, breakpoint) {
  if(defaultMap[attr]) {
    attr = defaultMap[attr];
  }
  return breakpoint ? `${attr}-${breakpoint}-${value}` : `${attr}-${value}`;
}

// Outputs css utility classes
// Should this mode bother resolving theme values? Probably useful.
// Maybe resolve values, but if it detects unsafe css characters ( parens/brackets, # ) then return styles string as well.
function getClassnames(attrs, theme) {
  const breakpoints = Object.entries(theme.breakpoints || {});
  const entries = Object.entries(attrs);
  return entries.reduce((acc, [attr, value]) => {
    attr = attr.replace(/[a-z][A-Z]/g, (m) => m[0] + '-' + m[1].toLowerCase());
    if(typeof value === 'undefined' || value === null) {
      return acc;
    }
    if(typeof value === 'string') {
      value = value.split(/\./g).join('-');
    } else if (Array.isArray(value)) {
      // parse breakpoints
      const classnames = value.reduce((a, v, i) => a + ` ${getClassname(attr, v, breakpoints[i][0])}`, '');
      return acc + ` ${classnames}`;
    }
    return acc + ` ${getClassname(attr, value)}`;
  }, '').trim();
}

export function parse(attrs, theme) {
  const classnames = getClassnames(attrs, theme);
  return {classnames};
}