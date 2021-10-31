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
- Portable - No extra build tools needed. (SASS/LESS compilers, wwebpack loaders, etc)

## Usage

Similar to Chakra UI, each component takes a set of properties. The properties can be defined as a responsive array or as single values. These values can be css-values _or_ be a reference to a value in your theme.

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

## Customize

Customization is based on design tokens, specifically the [theme specification](https://styled-system.com/theme-specification/) design tokens format. Ideally you write your design tokens in JSON and those tokens then get translated into css variables. Your style dictionary should also be provided as the `theme` attribute to the provider.

Your custom theme will be merged with the default theme, so it's not necessary to provide configs for every value if you happen to like the defaults.

There are also component variant styles, layer styles, and colorSchemes that will help keep your design consistent across as many diffferent themes as you need. Themes can be tested and swapped out on-the-fly client-side as well.

### Adding new attributes globally

Let's say you want every component to accept a new attribute. Simply add a new config.

```marko
<provider config={}>
  ...
</provider>
```

## Development

*Note* There is a bug where nested taglibs don't resolve properly. For now the components folder from `mikro-ui` was symlinked into the `website` folder. This may not work properly on windows or machines that don't support symlinks. If the symlink isn't automatically created when cloning the repo, do this:

```sh
cd website
ln -s ../packages/mikro-ui/components ./components
```

Currently development consists of building the documentation using the componennts here. In the future unit testing and performance testing will be the primary goal.

```sh
git clone ....
cd mikro/website
npm install
npm run dev
```
