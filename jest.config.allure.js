/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "allure-jest/node",
  testMatch: ["**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"]
};
