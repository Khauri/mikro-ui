# mikro-tokens

This is a sass-based package that turns design tokens written in JSON (or js) into sass variables as well as provides a set of mixins and functions that can further transform those tokens into utility classes (similar to tailwind or bootstrap 5).

### Why JSON?

JSON is a pretty universal and easy to parse format. Writing your design tokens in JSON allows them to be re-used in multiple places. The goal of this project is to allow a design token-based system to be used as metadata on the client for component libraries as well as on the server for utility building.

## Usage

```sh
npm install <whatever-this-package-is-named>
```

### CLI

You can use the CLI to convert your tokens to an scss theme map which you can then import and use with the mixins/functions in this paackage to construct the utility classes. Internally json-to-scss is used.

```sh
this-package ./tokens.js -o tokens.scss
```

### API

The API is useful for integration into build tools and compilers as part of an automated process. For example, being able to `@import` the theme js[on] file using webpack and having it automatically transformed into a map.

```
const api = require('this-package');
const theme = { /* ... */ };

api.fromObject(theme); // returns scss file contents as a buffer/string
```

This can be especially useful for watching for changes in the theme and recompiling it.

## Mixins

Once you have your theme map imported, use the scss mixins to add the necessary scss to your project.

```scss
@use 'path/to/theme' as theme;
@use '<this-package>/utils' as u;

@include u.theme-vars(theme.$tokens);
```

## Tokens

Your tokens will be a JSON object containing standard definitions for your properties.

Supported properties include:

- colors
- space
- sizes
- fonts
- fontSizes
- fontWeights
- lineHeights
- letterSpacings
- zIndices
- radii

You can also include an options object which has these additional properties:

- prefix - The prefix used when generating the css variables.
- utilities
  - exclude - A list of utilities names to exclude from the generation
  - include - A map of utility class definitions to generate.

### Aliases

Aliases are a work in progress and the syntax is subject to change.

You can reference any other value in your theme by passing in the path to that value. Make sure that the path resolves to a terminal value or else you may end up with unintended results.

```js
module.exports = {
  colors: {
    blue: {
      300: "#63b3ed",
    },
    brand: "colors.blue.300"
  }
}
```

Output:

```
:root {
  --colors-blue-300: #64b3ed;
  --colors-brand: var(--colors-blue-300);
}

.bg-blue-300 {
  background-color: var(--colors-blue-300);
}

.bg-brand {
  background-color: var(--colors-brand);
}

/* ...etc */
```

### Theming

As seen above, design tokens are output as css variables.
These css variables are then used when constructing a suite of utility classes.

If you wanted to switch themes on the fly all you need to do is override the css variable and then all components that use the utility class will immediately switch to using the new values.

You can load the new values from an external stylesheet or append them inline using code. Some mixins and functions (both js and css) should be available to support these use cases.

The rules of CSS variable inheritance apply, which means that if you add a variable to only a portion of your document, then only that portion will be affected by the variable.

CSS variables are ideal here because it allows you to override the values for _some_ components while keeping it the same for others.
