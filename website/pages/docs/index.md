# Getting Started

Mikro is a UI starter kit for Marko-JS *heavily* inspired by Chakra UI. This documentation is itself generated using mikro components.

***Mikro is not production ready. Test at your own risk.***

## Installation 

When installing `mikro` ensure that you also install `marko` and `@marko/tags-api-preview`.

```
npm install mikro marko @marko/tags-api-preview
```

That's it. You can now use mikro's tags in your templates.

## Configuration

Use the `<provider>` tag to customize the theme as well as set other configurations. You can add as many provider tags as you want and the configs will be merged automatically unless you set `merge=false`.

Example:
```html
import theme from '../path/to/my/theme.js';

<!doctype html>
<html>
  <head>
    <title> Hello, World! </title>
  </head>
  <body>
    <provider theme=theme>
      <text>Hello, World!</text>
    </provider>
  </body>
</html>
```