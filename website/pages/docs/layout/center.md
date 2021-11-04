# Center

The `<center>` component centers the contents of its children using a simple flexbox trick.

Example:

<preview>
  <center bg="tomato" color="white">
    <text>This text is centered!</text>
  </center>
</preview>

Additionally there is also `<square>`, which centers content in a square container.

```
<square size="40px" color="white" bg="tomato">Hi</square>
```

As well as `<circle>` which is just a `<square>` with rounded borders.

```
<circle size="40px" color="white" bg="tomato">Bye</circle>
```

Examples:

<preview flex>
  <square size="50px" color="white" bg="tomato">Hi</square>
  <circle size="50px" color="white" bg="tomato" ml=2>Bye</circle>
</preview>