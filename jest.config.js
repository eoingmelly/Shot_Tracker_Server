// jest.config.js
module.exports = {
  testEnvironment: "node",

  setupFiles: ["<rootDir>/jest.setup.js"],
  verbose: true,

  // ✅ Let Jest search the entire project (not just /modules)
  roots: ["<rootDir>"],

  // ✅ Match all .test.js files anywhere
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).[jt]s"],

  // ✅ Coverage collection for everything except tests & node_modules
  collectCoverageFrom: [
    "**/*.js",
    "!**/__tests__/**",
    "!**/node_modules/**",
    "!jest.config.js",
  ],
};
