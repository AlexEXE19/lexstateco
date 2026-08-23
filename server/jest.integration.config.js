// Separate from jest.config.js on purpose: these tests spin up a real,
// throwaway MySQL container (see test/globalSetup.js) instead of mocking
// Sequelize, so they're slower and need Docker. Run them explicitly with
// `npm run test:integration`, not as part of the default `npm test`.
module.exports = {
  testMatch: ["**/*.integration.test.js"],
  globalSetup: "<rootDir>/test/globalSetup.js",
  globalTeardown: "<rootDir>/test/globalTeardown.js",
  testTimeout: 30000,
};
