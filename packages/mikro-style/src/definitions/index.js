import color from './color';
import space from './space';
import layout from './layout';
import flexbox from './flexbox';
import typography from './typography';
import border from './border';

export const definitions = {
  color, 
  space, 
  layout, 
  flexbox, 
  typography, 
  border
};

const propertiesMap = {
  ...color,
  ...space,
  ...layout,
  ...flexbox,
  ...typography,
  ...border
};

// resolve aliases
export const properties = Object.entries(propertiesMap).reduce((acc, [key, value]) => {
  if(Array.isArray(value.aliases)) {
    value.aliases.forEach(alias => {
      acc[alias] = value;
    });
  }
  acc[key] = value;
  return acc;
}, {});
