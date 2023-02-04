/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('ts-jest').JestConfigWithTsJest} */

// Reference: https://github.com/preactjs/jest-preset-preact/blob/master/src/preset.js

const path = require("path");

const mappedModules = {
  "^react/jsx-runtime$": "preact/jsx-runtime",
  "^react-dom$": "preact/compat",
  "^react$": "preact/compat",
  // Noop style files
  "^.+\\.(css|sass|scss|less)$": "identity-obj-proxy",
};

module.exports = {
  collectCoverageFrom: ["src/**/*.{mjs,js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  moduleNameMapper: mappedModules,
  // Transpiling
  transform: {
    "^.+\\.(mjs|js|jsx|ts|tsx)$": path.resolve(__dirname, "setup", "babel.js"),
  },
  // Serialize Preact VNodes to strings for `toMatchSnapshot()`
  snapshotSerializers: [path.resolve(__dirname, "setup", "serializer.js")],
  transformIgnorePatterns: ["^.+\\.(css|sass|scss|less)$"],
  testEnvironment: "jsdom",
  // Load node build, not the browser build
  // https://github.com/preactjs/preact/pull/3634#discussion_r930171882
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};
