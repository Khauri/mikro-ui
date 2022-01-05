var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.js
var src_exports = {};
__export(src_exports, {
  parse: () => parse,
  splitAttributes: () => splitAttributes
});

// src/definitions/hash.js
function hash(str) {
  var h = 0;
  var k, i = 0, len = str.length;
  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
    k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
    k ^= k >>> 24;
    h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 255) << 16;
    case 2:
      h ^= (str.charCodeAt(i + 1) & 255) << 8;
    case 1:
      h ^= str.charCodeAt(i) & 255;
      h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  h ^= h >>> 13;
  h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

// src/definitions/color.js
var color_default = {
  bg: { properties: ["background-color"], theme: "colors" },
  color: { properties: ["color"], theme: "colors" }
};

// src/definitions/space.js
var space_default = {
  p: { properties: ["padding"], theme: "space", responsive: true },
  pt: { properties: ["padding-top"], theme: "space", responsive: true },
  pr: { properties: ["padding-right"], theme: "space", responsive: true },
  pb: { properties: ["padding-bottom"], theme: "space", responsive: true },
  pl: { properties: ["padding-left"], theme: "space", responsive: true },
  px: { properties: ["padding-left", "padding-right"], theme: "space", responsive: true },
  py: { properties: ["padding-top", "padding-bottom"], theme: "space", responsive: true },
  m: { properties: ["margin"], theme: "space", responsive: true },
  mt: { properties: ["margin-top"], theme: "space", responsive: true },
  mr: { properties: ["margin-right"], theme: "space", responsive: true },
  mb: { properties: ["margin-bottom"], theme: "space", responsive: true },
  ml: { properties: ["margin-left"], theme: "space", responsive: true },
  mx: { properties: ["margin-left", "margin-right"], theme: "space", responsive: true },
  my: { properties: ["margin-top", "margin-bottom"], theme: "space", responsive: true }
};

// src/definitions/layout.js
var display = { properties: ["display"], values: ["block", "inline", "flex", "inline-flex", "grid", "inline-grid"] };
var layout_default = {
  d: display,
  display,
  position: { properties: ["position"], values: ["absolute", "relative", "sticky"] },
  top: { properties: ["top"], theme: "space" },
  right: { properties: ["right"], theme: "space" },
  bottom: { properties: ["bottom"], theme: "space" },
  left: { properties: ["left"], theme: "space" },
  z: { properties: ["z-index"], theme: "zIndices" },
  w: { properties: ["width"], theme: "sizes" },
  h: { properties: ["height"], theme: "sizes" },
  maxW: { properties: ["max-width"], theme: "sizes" },
  maxH: { properties: ["max-height"], theme: "sizes" },
  minW: { properties: ["min-width"], theme: "sizes" },
  minH: { properties: ["min-height"], theme: "sizes" },
  overflow: { properties: ["overflow"], values: ["auto", "hidden", "scroll", "visible"] },
  overflowX: { properties: ["overflow-x"], values: ["auto", "hidden", "scroll", "visible"] },
  overflowY: { properties: ["overflow-x"], values: ["auto", "hidden", "scroll", "visible"] }
};

// src/definitions/flexbox.js
var flexbox_default = {
  flex: { properties: ["flex"] },
  flexAlign: { properties: ["align-items"], values: [] },
  flexBasis: { properties: ["flex-basis"], values: [] },
  flexDirection: { properties: ["flex-direction"], values: [] },
  justifyContent: { properties: ["justify-content"], values: [] },
  flexGrow: { properties: ["flex-grow"], values: [] },
  flexShrink: { properties: ["flex-shrink"], values: [] },
  flexWrap: { properties: ["flex-wrap"], values: [] }
};

// src/definitions/typography.js
var typography_default = {
  fontFamily: { properties: ["font-family"], theme: "fonts" },
  fontSize: { properties: ["font-size"], theme: "fontSizes" },
  fontWeight: { properties: ["font-weight"], theme: "fontWeights" },
  lineHeight: { properties: ["line-height"], theme: "lineHeights" },
  letterSpacing: { properties: ["letter-spacing"], theme: "letterSpacings" },
  textAlign: { properties: ["text-align"] },
  fontStyle: { properties: ["font-style"] },
  textTransform: { properties: ["text-transform"] }
};

// src/definitions/border.js
var border_default = {
  border: { properties: ["border"], theme: "borders" },
  borderWidth: { properties: ["border-width"], theme: "borderWidth" },
  borderRadius: { properties: ["border-radius"], theme: "radii" },
  borderStyle: { properties: ["border-style"], values: [] },
  borderColor: { properties: ["border-color"], theme: "colors" },
  borderLeft: { properties: ["border-left"], theme: "borders" },
  borderLeftColor: { properties: ["border-left-color"], theme: "colors" },
  borderLeftWidth: { properties: ["border-left-width"], theme: "borderWidth" }
};

// ../mikro-theme-default/src/colors.js
var colors = {
  transparent: "transparent",
  current: "currentColor",
  black: "#000000",
  white: "#FFFFFF",
  whiteAlpha: {
    50: "rgba(255, 255, 255, 0.04)",
    100: "rgba(255, 255, 255, 0.06)",
    200: "rgba(255, 255, 255, 0.08)",
    300: "rgba(255, 255, 255, 0.16)",
    400: "rgba(255, 255, 255, 0.24)",
    500: "rgba(255, 255, 255, 0.36)",
    600: "rgba(255, 255, 255, 0.48)",
    700: "rgba(255, 255, 255, 0.64)",
    800: "rgba(255, 255, 255, 0.80)",
    900: "rgba(255, 255, 255, 0.92)"
  },
  blackAlpha: {
    50: "rgba(0, 0, 0, 0.04)",
    100: "rgba(0, 0, 0, 0.06)",
    200: "rgba(0, 0, 0, 0.08)",
    300: "rgba(0, 0, 0, 0.16)",
    400: "rgba(0, 0, 0, 0.24)",
    500: "rgba(0, 0, 0, 0.36)",
    600: "rgba(0, 0, 0, 0.48)",
    700: "rgba(0, 0, 0, 0.64)",
    800: "rgba(0, 0, 0, 0.80)",
    900: "rgba(0, 0, 0, 0.92)"
  },
  gray: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "#171923"
  },
  red: {
    50: "#FFF5F5",
    100: "#FED7D7",
    200: "#FEB2B2",
    300: "#FC8181",
    400: "#F56565",
    500: "#E53E3E",
    600: "#C53030",
    700: "#9B2C2C",
    800: "#822727",
    900: "#63171B"
  },
  orange: {
    50: "#FFFAF0",
    100: "#FEEBC8",
    200: "#FBD38D",
    300: "#F6AD55",
    400: "#ED8936",
    500: "#DD6B20",
    600: "#C05621",
    700: "#9C4221",
    800: "#7B341E",
    900: "#652B19"
  },
  yellow: {
    50: "#FFFFF0",
    100: "#FEFCBF",
    200: "#FAF089",
    300: "#F6E05E",
    400: "#ECC94B",
    500: "#D69E2E",
    600: "#B7791F",
    700: "#975A16",
    800: "#744210",
    900: "#5F370E"
  },
  green: {
    50: "#F0FFF4",
    100: "#C6F6D5",
    200: "#9AE6B4",
    300: "#68D391",
    400: "#48BB78",
    500: "#38A169",
    600: "#2F855A",
    700: "#276749",
    800: "#22543D",
    900: "#1C4532"
  },
  teal: {
    50: "#E6FFFA",
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795",
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044"
  },
  blue: {
    50: "#ebf8ff",
    100: "#bee3f8",
    200: "#90cdf4",
    300: "#63b3ed",
    400: "#4299e1",
    500: "#3182ce",
    600: "#2b6cb0",
    700: "#2c5282",
    800: "#2a4365",
    900: "#1A365D"
  },
  cyan: {
    50: "#EDFDFD",
    100: "#C4F1F9",
    200: "#9DECF9",
    300: "#76E4F7",
    400: "#0BC5EA",
    500: "#00B5D8",
    600: "#00A3C4",
    700: "#0987A0",
    800: "#086F83",
    900: "#065666"
  },
  purple: {
    50: "#FAF5FF",
    100: "#E9D8FD",
    200: "#D6BCFA",
    300: "#B794F4",
    400: "#9F7AEA",
    500: "#805AD5",
    600: "#6B46C1",
    700: "#553C9A",
    800: "#44337A",
    900: "#322659"
  },
  pink: {
    50: "#FFF5F7",
    100: "#FED7E2",
    200: "#FBB6CE",
    300: "#F687B3",
    400: "#ED64A6",
    500: "#D53F8C",
    600: "#B83280",
    700: "#97266D",
    800: "#702459",
    900: "#521B41"
  }
};
var colors_default = colors;

// ../mikro-theme-default/src/space.js
var space_default2 = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem"
};

// ../mikro-theme-default/src/sizes.js
var sizes_default = {
  ...space_default2,
  max: "max-content",
  min: "min-content",
  full: "100%",
  "3xs": "14rem",
  "2xs": "16rem",
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  "8xl": "90rem",
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px"
  }
};

// ../mikro-theme-default/src/breakpoints.js
var breakpoints_default = {
  "sm": "30em",
  "md": "48em",
  "lg": "62em",
  "xl": "80em",
  "2xl": "96em"
};

// ../mikro-theme-default/src/components/text.js
var text_default = {
  baseStyle: {
    fontFamily: "body",
    lineHeight: "tall"
  },
  sizes: {},
  variants: {}
};

// ../mikro-theme-default/src/components/header.js
var header_default = {
  baseStyle: {
    fontFamily: "heading"
  },
  sizes: {},
  variants: {}
};

// ../mikro-theme-default/src/components/btn.js
var btn_default = {
  baseStyle: {
    fontWeight: "bold",
    border: 0,
    borderRadius: "md",
    px: 4,
    py: 2
  },
  sizes: {},
  variants: {
    primary: {
      bg: "gray.500",
      color: "white"
    }
  }
};

// ../mikro-theme-default/src/components/index.js
var components_default = {
  text: text_default,
  header: header_default,
  btn: btn_default
};

// ../mikro-theme-default/src/index.js
var src_default = {
  colors: colors_default,
  space: space_default2,
  sizes: sizes_default,
  breakpoints: breakpoints_default,
  components: components_default,
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace"
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem"
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },
  lineHeights: {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: "2",
    "3": ".75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem"
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  zIndices: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1e3,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },
  radii: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px"
  }
};

// src/index.js
var properties = {
  ...space_default,
  ...layout_default,
  ...flexbox_default,
  ...color_default,
  ...typography_default,
  ...border_default
};
function getDeep(key, obj) {
  return key.split(/\./g).reduce((o, i) => o[i], obj);
}
function sortEntriesByKey(entry1, entry2) {
  return entry1[0].localeCompare(entry2[0]);
}
function resolve(prop, value, theme) {
  return prop.properties.map((property) => {
    if (prop.values) {
      return `${property}:${value};`;
    }
    if (typeof theme?.[prop.theme] === "object" && typeof value === "string") {
      value = getDeep(value, theme[prop.theme]) || value;
    }
    if (theme?.[prop.theme]?.[value]) {
      return `${property}:var(--mikro-${prop.theme}-${value});`;
    }
    return `${property}:${value};`;
  }).join("");
}
function getRules(attrs, theme, cache) {
  const entries = Object.entries(attrs);
  const classname = hash(entries.sort(sortEntriesByKey).flat().join(";"));
  let css = cache[classname];
  if (!css) {
    css = entries.reduce((str, [key, value]) => str + resolve(properties[key], value, theme), "");
    cache[classname] = css;
  }
  css = `.css-${classname} {${css}}`;
  return { css, classname };
}
function getBreakpointClassname(attr, value, breakpoint) {
  return `${attr}-${breakpoint}-${value}`;
}
function getStyles(attrs, theme) {
  const entries = Object.entries(attrs);
  return entries.reduce((acc, [key, value]) => {
    const property = properties[key];
    property.properties.forEach((prop) => {
      acc += resolve(property, value, theme);
    });
    return acc;
  }, "");
}
function getClassnames(attrs, theme) {
  const breakpoints = Object.entries(theme.breakpoints);
  const entries = Object.entries(attrs);
  return entries.reduce((acc, [attr, value]) => {
    attr = attr.replace(/[a-z][A-Z]/g, (m) => m[0] + "-" + m[1].toLowerCase());
    if (typeof value === "undefined" || value === null) {
      return acc;
    }
    if (typeof value === "string") {
      value = value.split(/\./g).join("-");
    } else if (Array.isArray(value)) {
      const classnames = value.reduce((a, v, i) => a + ` ${getBreakpointClassname(attr, v, breakpoints[i][0])}`, "");
      return acc + ` ${classnames}`;
    }
    return acc + ` ${[attr, value].join("-")}`;
  }, "").trim();
}
function splitAttributes({
  input,
  component,
  variant,
  layerStyle,
  theme = src_default
}) {
  const unusedAttrs = {};
  const attrs = {
    ...theme?.components?.[component]?.baseStyle,
    ...theme?.components?.[component]?.variants?.[variant],
    ...theme?.layerStyles?.[layerStyle],
    ...input
  };
  for (const key in attrs) {
    if (!properties[key]) {
      unusedAttrs[key] = attrs[key];
      delete attrs[key];
    }
  }
  return { unusedAttrs, attrs };
}
function parse({
  input,
  component,
  variant,
  layerStyle,
  theme = src_default,
  cache,
  mode
}) {
  if (typeof theme === "undefined") {
    console.warn("No theme defined. Using default theme.");
  }
  const { unusedAttrs, attrs } = splitAttributes({ input, component, variant, layerStyle, theme });
  if (mode === "class") {
    const classnames = getClassnames(attrs, theme);
    return { attrs: unusedAttrs, classnames };
  }
  if (mode === "inline") {
    const styles = getStyles(attrs, theme);
    return { attrs: unusedAttrs, styles };
  }
  const { css, classname } = getRules(attrs, theme, cache);
  return { attrs: unusedAttrs, css, classname };
}
module.exports = __toCommonJS(src_exports);