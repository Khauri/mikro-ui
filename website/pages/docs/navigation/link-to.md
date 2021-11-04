# link-to

Link-to renders an anchor tag (`<a href=...>`).

## Why link-to and not link?

`link` is already the name of the component used to link sytlesheets, so using the same name would have caused conflict.

## Usage

Preferred: pass the url as a default argument to the component. This helps the component "read" better.

```
<link-to="/info">Info</link-to>
```

However, you can also use the `href` property as you would a normal anchor tag.

<preview>
  <link-to="#">Click Me!</link-to>
</preview>

## External links

All links that link to external sites or opens up a new tab should have a visual indication that it does so.