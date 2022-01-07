// TODO: Consider some kind of alias feature
const display = {properties: ['display'], values: ['block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid']};

const overflowValues = ['auto', 'hidden', 'scroll', 'visible'];

export default {
  d: {properties: ['display'], aliases: ['display'], values: ['block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid']},
  position: {properties: ['position'], values: ['absolute', 'relative', 'sticky']},
  top: {properties: ['top'], theme: 'space'},
  right: {properties: ['right'], theme: 'space'},
  bottom: {properties: ['bottom'], theme: 'space'},
  left: {properties: ['left'], theme: 'space'},
  z: {properties: ['z-index'], aliases: ['zIndex'], theme: 'zIndices'},
  w: {properties: ['width'], aliases: ['width'], theme: 'sizes'},
  h: {properties: ['height'], aliases: ['height'], theme: 'sizes'},
  maxW: {properties: ['max-width'], aliases: ['maxWidth'], theme: 'sizes'},
  maxH: {properties: ['max-height'], aliases: ['maxHeight'], theme: 'sizes'},
  minW: {properties: ['min-width'], aliases: ['minWidth'], theme: 'sizes'},
  minH: {properties: ['min-height'], aliases: ['minHeight'], theme: 'sizes'},
  overflow: {properties: ['overflow'], values: overflowValues},
  overflowX: {properties: ['overflow-x'], values: overflowValues},
  overflowY: {properties: ['overflow-y'], values: overflowValues}
};
