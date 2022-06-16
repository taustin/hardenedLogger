"use strict";

const Logger = require("./logger");

const fs = require('fs');
const net = require('net');
const readline = require('readline');
const stream = require('stream');

const DEBUG_LEVELS = 5;
const MAX_DELAY = 1000;

let instream = fs.createReadStream('./sample.log');
let outstream = new stream();
let rl = readline.createInterface(instream, outstream);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

rl.on('line', (line) => {
  let level = getRandomInt(DEBUG_LEVELS);
  //logger.log(level, line);
  let connection = net.connect({port: 9000}, () => {
    connection.write(`${level}${line}`);
  });
});
