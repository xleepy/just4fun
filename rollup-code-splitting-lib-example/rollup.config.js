const { defineConfig } = require("rollup");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

const plugins = [resolve(), commonjs()];
module.exports = [
  defineConfig({
    input: {
      index: "./src/index.js",
      "module/a": "./src/a/index.js",
      "module/b": "./src/b/index.js",
    },
    output: {
      dir: "dist",
      format: "commonjs",
    },
    plugins,
  }),
];
