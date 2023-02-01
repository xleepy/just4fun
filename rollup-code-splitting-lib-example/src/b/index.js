const { message, color } = require("../used-by-b");
const { appendToBody } = require("../util");

const paragraph = document.createElement("p");

paragraph.innerText = message;
paragraph.style.color = color;

appendToBody(paragraph);
