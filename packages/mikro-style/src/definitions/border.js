// shout out to github copilot for this file
const borderStyles = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'];

export default {
  // generic
  border: {properties: ['border'], aliases: ['b'], theme: 'borders'},
  borderWidth: {properties: ['border-width'], theme: 'borderWidth'},
  borderRadius: {properties: ['border-radius'], theme: "radii"},
  borderStyle: {properties: ['border-style'], values: borderStyles},
  borderColor: {properties: ['border-color'], theme: 'colors'},
  // border-left
  borderLeft: {properties: ['border-left'], aliases: ['bl'], theme: 'borders'},
  borderLeftWidth: {properties: ['border-left-width'], theme: 'borderWidth'},
  borderLeftRadius: {properties: ['border-left-radius'], theme: "radii"},
  borderLeftStyle: {properties: ['border-left-style'], values: borderStyles},
  borderLeftColor: {properties: ['border-left-color'], theme: 'colors'},
  // border-right
  borderRight: {properties: ['border-right'], aliases: ['br'], theme: 'borders'},
  borderRightWidth: {properties: ['border-right-width'], theme: 'borderWidth'},
  borderRightRadius: {properties: ['border-right-radius'], theme: "radii"},
  borderRightStyle: {properties: ['border-right-style'], values: borderStyles},
  borderRightColor: {properties: ['border-right-color'], theme: 'colors'},
  // border-top
  borderTop: {properties: ['border-top'], aliases: ['bt'], theme: 'borders'},
  borderTopWidth: {properties: ['border-top-width'], theme: 'borderWidth'},
  borderTopRadius: {properties: ['border-top-radius'], theme: "radii"},
  borderTopStyle: {properties: ['border-top-style'], values: borderStyles},
  borderTopColor: {properties: ['border-top-color'], theme: 'colors'},
  // border-bottom
  borderBottom: {properties: ['border-bottom'], aliases: ['bb'], theme: 'borders'},
  borderBottomWidth: {properties: ['border-bottom-width'], theme: 'borderWidth'},
  borderBottomRadius: {properties: ['border-bottom-radius'], theme: "radii"},
  borderBottomStyle: {properties: ['border-bottom-style'], values: borderStyles},
  borderBottomColor: {properties: ['border-bottom-color'], theme: 'colors'},
  // border-x
  borderX: {properties: ['border-left', 'border-right'], aliases: ['bx'], theme: 'borders'},
  borderXWidth: {properties: ['border-left-width', 'border-right-width'], theme: 'borderWidth'},
  borderXRadius: {properties: ['border-left-radius', 'border-right-radius'], theme: "radii"},
  borderXStyle: {properties: ['border-left-style', 'border-right-style'], values: borderStyles},
  borderXColor: {properties: ['border-left-color', 'border-right-color'], theme: 'colors'},
  // border-y
  borderY: {properties: ['border-top', 'border-bottom'], aliases: ['by'], theme: 'borders'},
  borderYWidth: {properties: ['border-top-width', 'border-bottom-width'], theme: 'borderWidth'},
  borderYRadius: {properties: ['border-top-radius', 'border-bottom-radius'], theme: "radii"},
  borderYStyle: {properties: ['border-top-style', 'border-bottom-style'], values: borderStyles},
  borderYColor: {properties: ['border-top-color', 'border-bottom-color'], theme: 'colors'},
}