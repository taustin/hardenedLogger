"use strict";

const Logger = require("./logger");

let logger = new Logger({ powLeadingZeroes: 19 });

// Writing open array comment
console.log("[");

logger.startServer(9000);

