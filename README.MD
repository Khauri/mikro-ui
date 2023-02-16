## Mikro

> Warning: most of the tags in this repo are in development/testing. Use at your own risk (happily accepting contributions as well).
> Also note that not everything present in this README is implemented

This is a design-system starter UI kit. These components, along with theming functionality, are used as a basis for creating your own components.

The main goal is to create a shared, easily referencable language for component architecture.

A secondary goal is to enable the creation of community components without the added burden of figuring out how to incorporate styles. Component creators do not need to burden themselves with using plain css over pre-compiled. mikro gives you an api and it's up to the end user to decide how the styles will be output.

Inspiration: Chakra UI, Rebass, Styled Components, Bootstrap, Tailwind.

### Principles

Based on my own personal use case, Mikro is being built with these principles in mind:

- Composable - Components can be extended and used to create other components.
- Helpful - Documentation is clear and concise. 
- Efficient - As little overhead on both client and server as possible
- Accesssible - Standard acessibility concerns are met.
- Portable - No extra build tools needed. (SASS/LESS compilers, webpack loaders, etc)

## Installation

mikro requires `marko` as well as the `marko/tags-api-preview` as peer dependencies, so please ensure you have them installed when installing `mikro`.

```sh
npm install marko @marko/tags-api-preview mikro-ui
```

That's pretty much it. Due to Marko's tag resolution algorithm you will be able to immediately use the mikro tags that were installed. Refer to the documentation to configure the behavior.

### Packages

The mikro tags are split into individual packages and the essential tags are combined into one package -- `mikro-ui`, for convenience. If you only want to install a subset of the tags, install those packages individually.

| **Package** | **Description** | **Version** |
| ----------- | --------------- | --------------- |
| [@mikro-ui/core](./packages/mikro-ui-core) | Core mikro components. | [<img src="https://img.shields.io/npm/v/@mikro-ui/core" alt="npm" />](https://www.npmjs.com/package/@mikro-ui/core) |
| [@mikro-ui/style](./packages/mikro-style) | Style parser for converting attributes to classes or inline style strings. | [<img src="https://img.shields.io/npm/v/@mikro-ui/style" alt="npm" />](https://www.npmjs.com/package/@mikro-ui/style) |
| [@mikro-ui/test](./packages/mikro-test) | Fixture-based component testing framework. | [<img src="https://img.shields.io/npm/v/@mikro-ui/test" alt="npm" />](https://www.npmjs.com/package/@mikro-ui/test) |

## Usage

Similar to Chakra UI, each component takes a set of properties. The properties can be defined as a responsive array or as single values. These values can be css-values (in css-mode) _or_ be a reference to a value in your theme (in any mode).

```marko
<flex p=[1,2,3] direction="column" align="center" justify="center" bg="colors.brand">
  <header>Hello, World!</header>
</flex>
```

## Composition

Suppose you want to create a custom component that can handle arbitrary style props.

Simply use the `<styled>` tag and pass in all the input. This will return a class string as well as any unuse attributes that you can pass to other components.

Simply pass the class string to your element and now any styles passed 

```marko
<styled/{classes, attrs} ...input />
<button class=classes><button>
```

## Theming/Customization

Customization is based on design tokens, specifically the [theme specification](https://styled-system.com/theme-specification/) design tokens format. Ideally you write your design tokens in JSON and those tokens then get translated into css variables. Your style dictionary should also be provided as the `theme` attribute to the provider.

Your custom theme will be merged with the default theme, so it's not necessary to provide configs for every value if you happen to like the defaults.

There are also component variant styles, layer styles, and colorSchemes that will help keep your design consistent across as many diffferent themes as you need. Themes can be tested and swapped out on-the-fly client-side as well.

## Development

Currently development consists of building the documentation using the components here.
In the near future unit testing and performance testing will be the primary goal.

This project is managed with `Yarn Workspaces`. Ensure you have the version of yarn specified in the `packageManager` section of the `package.json` instealled.

```sh
git clone ....
yarn install
yarn dev
```
