# Mikro-Ui Core

This package contains core components used by mikro which can also be used as a base for other design systems.

Think of it as a marko equivalent to `emotion`/`styled-components`.

This package contains these tags:

## styled

This is the main workhorse of the entire system.
This tag takes a number of css-properties as well as some other properties and returns either a class string or a style string depending on the mode.

Any unused properties will be returned in `attrs`.

```marko
<styled/{classname, styles, attrs} display="flex" flexDirection="row" mode="inline" />

<div class=classname, style=styles ...attrs />
```

The three modes are as follows:

1. 'fly'/default - This is a css-in-js like mode that compiles dynamically adds stylesheets and css to the DOM dynamically.
2. 'class' - This mode outputs utility classes in a specific format for cases when a stylesheet already exists (ie tailwind). You can customize the format of the classes by passing in a customizer function to the style-provider.
3. 'inline' - All styles are inlined. Note that this currently does not work with breakpoints.

## styled-provider

This tag allows you to set some custom properties for all tags underneath this provider. 
For example it can be used to provide a theme, set a customizer for class mode, as well as set the mode for any styled tags used.

```marko
<styled-provider mode="inline">
  <styled/{classname, styles} />
  <div class=classname, style=styles />
</styled-provider>
```

The provider can be nested under itself and when doing so any additional themes provided are automatically merged. To prevent this from happening simply pass `no-merge-theme` into the provider.

## css

This tag simply renders a `<style>` tag on the client. This is used for the `class` and `fly` modes.

The reason is that the `<style>` tag in marko has special behavior _and_ cannot be dynamically changed or dynamically populated.

## box

This is a foundational component that all other mikro components inherit from and can be used to construct your own components as well.
