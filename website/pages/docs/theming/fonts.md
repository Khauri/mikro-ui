# Fonts

The `<text>`, `<header>`, and `<code>` components will default to using the `body`, `heading`, and `mono` fonts in your theme, respectively.

You can override these fonts or add new ones by specifying them under the `fonts` section in your theme.

```
{
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Raleway', sans-serif",
    mono: "Menlo, monospace",
  }
}
```

You also need to ensure that your fonts are properly loaded on the page. There are a variety of ways to do so, but the easiest is to include a `<link>` tag in the `<head>` of your html file.

Example:
```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway&family=Roboto&display=swap" rel="stylesheet">
</head>
```

You could also use a `<style>` tag and include the component with an `import` and let Marko take care of placing it where it needs to go.

Example:
```html
<style>
  @import url('https://fonts.googleapis.com/css2?family=Raleway&family=Roboto&display=swap');
</style>
```

If you want your fonts to be dynamically loaded whenever you switch themes, then feel free to do the same as above, just using the `<css>` tag instead.

```
<css="@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Roboto&display=swap');" />
```
