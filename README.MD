## Mikro

This is a design-system starter UI kit. These components along with theming functionality are used as a basis for creating your own elements.

The goal is to create a shared, easily referencable language for component architecture as well as eliminate the chore of worrying about css.

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
npm install marko @marko/tags-api-preview mikro
```

That's pretty much it. Due to Marko's tag resolution algorithm you will be able to immediately use the mikro tags that were installed. Refer to the documentation to configure the behavior.

### Individual Packages

The mikro tags are split into individual packages and the essential tags are combined into one package -- `mikro`, for convenience. If you only want to install a subset of the tags, install those packages individually.

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

### Adding new attributes globally

Let's say you want every component to accept a new attribute. Use the provider to customize the attributes that a component will accept.

```marko
<const/theme={ /* ... */ } />

<styled-provider=theme attributes={}>
  ...
</styled-provider>
```

## Development

Currently development consists of building the documentation using the componennts here. In the future unit testing and performance testing will be the primary goal.

This project is managed with `Yarn Workspaces`.

```sh
git clone ....
yarn install
yarn dev
```

Some temporary patches have been applied to `@marko/build`, not because `@marko/build` is broken, but rather due to the laziness of not wanting to create the markdown -> marko transpilations myself. Also hoisting packages as yarn workspaces does causes a weird issue with specifically `sass` not being found using `resolve-from`. Too lazy to investigate so it was patched into a warning instead of an error.
