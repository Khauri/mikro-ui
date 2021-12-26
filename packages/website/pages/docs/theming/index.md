# Theming

Design systems makes it easy for teams of developers to create matching experiences without needing to think hard about if what they're creating matches the project goals. 

You can customize many aspects of mikro, such as color schemes, spacing, fonts, etc., in order to best match your design system and style guidelines.

## Quick Start

Create a `theme.js` file somewhere in your project. This file will be where the theme lives for this tutorial, but you can just as easily load a JSON file stored in a database if you wanted to.

```
module.exports = {};
```

And now we can set the theme by passing it as the `theme` attribute of our provider.

```
<provider>
  <!-- the rest of your page -->
</provider>
```

## Theme Merging

Not only can themes be swapped out on the fly just by changing what's passed into the provider, you can also use multiple providers to merge as many themes as you want together.

```
$ {
  const lightMode = {
    colors: {"background": "white", "text": "black"},
  };

  const darkMode = {
    colors: {"background": "black", "text": "white"},
  };
}

<provider theme=lightMode>
  <text> This text is in light mode. </text>
  <provider theme=darkMode>
    <text> This text is in dark mode. </text>
  </provider>
</provider>
```

> Note that this is just an example. You should really use layerStyles for this kind of thing.

In fact, the theme you pass into the provider at the top is automatically merged with the base mikro theme. If you do not want this merging behavior then you can simply pass in `merge=false` to the provider, however this means that you will need to provide a complete theme configuration.
