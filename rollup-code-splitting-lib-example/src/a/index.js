// inspired by https://github.com/rollup/rollup-starter-lib

const { message, color } = require("../used-by-a");
const { appendToBody } = require("../util");

const paragraph = document.createElement("p");

paragraph.innerText = message;
paragraph.style.color = color;

appendToBody(paragraph);
