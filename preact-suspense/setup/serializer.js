/* eslint-disable @typescript-eslint/no-var-requires */
const renderToString = require("preact-render-to-string/jsx");

module.exports = {
  test(value) {
    return (
      value && typeof value === "object" && value.constructor === undefined
    );
  },
  print(value, serialize, indent) {
    const result = renderToString(value);
    console.log(result);
    return indent(result);
  },
};
