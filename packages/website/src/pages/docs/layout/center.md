# Center

The `<center>` component centers the contents of its children using a simple flexbox trick.

Example:

<preview>
  <center bg="red.400" color="white">
    <text>This text is centered!</text>
  </center>
</preview>

Additionally there is also `<square>`, which centers content in a square container.

```
<square size="10" color="white" bg="red.400">Hi</square>
```

As well as `<circle>` which is just a `<square>` with rounded borders.

```
<circle size="10" color="white" bg="red.400">Bye</circle>
```

Examples:

<preview flex>
  <square size="10" color="white" bg="red.400">Hi</square>
  <circle size="10" color="white" bg="red.400" ml=2>Bye</circle>
</preview>