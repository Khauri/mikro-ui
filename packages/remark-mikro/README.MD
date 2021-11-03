# Remark-Mikro

This is a remark plugin that turns markdown into a marko file. When used in a bundler such as webpack it can be used to generate a marko template whenever a `.md` file is imported.

```js
{
  config: {
    module: {
      rules: [
        {
          test: /\.md/,
          use: [
            "marko-loader",
            {
              loader: "remark-loader",
              options: {
                remarkOptions: {
                  plugins: [RemarkMikro],
                },
              },
            },
          ],
        },
      ],
    }
  }
}
```

Currently this is only used internally by mikro-ui to generate the docs by turning markdown elements into basic mikro-based components, but in the future it may be possible to make this more general purpose so that anyone can use it.