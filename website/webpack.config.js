const path = require('path');
const {configBuilder} = require('@marko/build');
const RemarkMicro = require('remark-mikro');

const {getServerConfig, getBrowserConfigs} = configBuilder({
  entry: path.resolve(__dirname, './pages'),
  production: process.env.NODE_ENV === 'production',
});

function fixFullySpecifiedBug(config) {
  config.module.rules.unshift({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });
}

function addMarkdownToMarkoPlugin(config) {
  // new InjectPlugin(async function() {
  //   this.cacheable(false);
  //   // Grab all the md files and convert them
  // });
  console.dir(config.module.rules);
  config.module.rules.unshift({
    test: /\.md/,
    use: [
      // Borrow marko-loader from existing config
      // See: https://github.com/marko-js/cli/blob/main/packages/build/src/index.js#L166-L173
      config.module.rules[1].use[0],
      {
        loader: "remark-loader",
        options: {
          remarkOptions: {
            plugins: [RemarkMicro],
          },
        },
      },
    ],
  });
}

module.exports = [
  ...getBrowserConfigs(config => {
    // addMarkdownToMarkoPlugin(config);
    fixFullySpecifiedBug(config);
    return config;
  }),
  getServerConfig(config => {
    addMarkdownToMarkoPlugin(config);
    fixFullySpecifiedBug(config);
    return config;
  })
];