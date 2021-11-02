/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testMatch: ['**/__tests__/**/*.test.js'],
  preset: "@marko/jest/preset/browser",
  extensionsToTreatAsEsm: [".marko"],
  // transform: {},
};

module.exports = config;
