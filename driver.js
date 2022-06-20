"use strict";

const Logger = require("./logger");

// Get a random int in the range of 0-max.
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// We initialize the logger.  The compromised block
// (meaning the first rewritten block) is selected
// randomly, but won't be the first 25 or last 25
// (assuming that our blockchain is 1000 blocks).
let logger = new Logger({
  powLeadingZeroes: 19,
  compromisedBlockNumber: getRandomInt(950)+25,
});

// Writing open array comment.  The close array character
// needs to be appended manually.
console.log("[");

logger.startServer(9000);

