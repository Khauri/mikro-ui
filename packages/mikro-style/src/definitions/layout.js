// TODO: Consider some kind of alias feature
const display = {properties: ['display'], values: ['block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid']};

export default {
  d: display,
  display,
  position: {properties: ['position'], values: ['absolute', 'relative', 'sticky']},
  top: {properties: ['top'], theme: 'space'},
  right: {properties: ['right'], theme: 'space'},
  bottom: {properties: ['bottom'], theme: 'space'},
  left: {properties: ['left'], theme: 'space'},
  z: {properties: ['z-index'], theme: 'zIndices'},
  w: {properties: ['width'], theme: 'sizes'},
  h: {properties: ['height'], theme: 'sizes'},
  maxW: {properties: ['max-width'], theme: 'sizes'},
  maxH: {properties: ['max-height'], theme: 'sizes'},
  minW: {properties: ['min-width'], theme: 'sizes'},
  minH: {properties: ['min-height'], theme: 'sizes'},
  overflow: {properties: ['overflow'], values: ['auto', 'hidden', 'scroll', 'visible']},
  overflowX: {properties: ['overflow-x'], values: ['auto', 'hidden', 'scroll', 'visible']},
  overflowY: {properties: ['overflow-x'], values: ['auto', 'hidden', 'scroll', 'visible']}
};
