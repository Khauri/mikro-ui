const path = require('path');
const {configBuilder} = require('@marko/build');
const RemarkMikro = require('remark-mikro');
const loader = require('sass-loader');

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

/**
 * @description Adds a loader that parses md files into a marko template,
 * specifically using mikro components, but maybe in the future it'll be more configurable.
 * 
 * Note that this relies on patching the file loader rule included in @marko/build
 * so that the md file isn't output as an asset at the end.
 * Additional patches are applied to @marko/build to get it to properly find the md files.
 * 
 * TODO: remark-loader or webpack also seems to agressively cache the results right now.
 * @param {*} config 
 */
function addMarkdownToMarkoPlugin(config) {
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
            plugins: [RemarkMikro],
          },
        },
      },
    ],
  });
}

// Maybe turn this into a webpack plugin?
function addSassFunction(config) {
  const sassLoaderPath = require.resolve('sass-loader');
  const isSassLoader = (loader) => [sassLoaderPath, 'sass-loader'].includes(loader.loader) || loader.use && loader.use.some(isSassLoader);
  config.module.rules
    .filter(isSassLoader)
    .map((loader) => loader.use && loader.use.find(isSassLoader) || loader)
    .forEach(loader => {
      loader.options = {
        ...loader.options, 
        sassOptions: {
          ...loader.options?.sassOptions, 
          functions: {
            ...loader.options?.sassOptions?.functions,
            'json($path)': require('mikro-tokens/loader'),
          }
        }
      }
    });
  // console.dir(config.module.rules[6], {depth: null});
}

module.exports = [
  ...getBrowserConfigs(config => {
    addMarkdownToMarkoPlugin(config);
    fixFullySpecifiedBug(config);
    addSassFunction(config);
    return config;
  }),
  getServerConfig(config => {
    addMarkdownToMarkoPlugin(config);
    fixFullySpecifiedBug(config);
    addSassFunction(config);
    return config;
  })
];