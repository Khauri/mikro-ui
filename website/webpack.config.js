const path = require('path');
const { configBuilder } = require('@marko/build');

const { getServerConfig, getBrowserConfigs } = configBuilder({
  entry: path.resolve(__dirname, './docs'),
  production: process.env.NODE_ENV === 'production',
});

module.exports = [
  ...getBrowserConfigs(config => {
    config.module.rules.unshift({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  }),
  getServerConfig(config => {
    config.module.rules.unshift({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  })
];