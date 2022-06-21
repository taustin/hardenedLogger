"use strict";

const fs = require('fs')

function parseJSON(jsonFile) {
  let str = fs.readFileSync(jsonFile);
  return JSON.parse(str);
}

function calcStdDev(mean, durations) {
  let sumOfDiffs = 0;
  let n = 0;
  durations.forEach((d) => {
    let diff = d - mean;
    sumOfDiffs += diff**2;
    n++;
  });
  // Fabio -- check this next line.
  return Math.sqrt(sumOfDiffs / (n-1));
}

function printStats(bc) {
  let totalTime = 0;
  let durations = [];
  let foundTime = null;
  let startTime = null;
  let lastProof = null;
  bc.forEach((data) => {
    let id = Object.keys(data)[0];
    let block = data[id];
    startTime = foundTime;
    foundTime = block.timestamp;
    if (startTime) {
      let duration = foundTime-startTime;
      durations.push(duration);
      totalTime += duration;
      console.log(`Block ${block.chainLength-1} took ${duration} seconds to find with proof ${lastProof}.`)
    }
    lastProof = block.proof;
  });
  console.log("==========");
  // Subtracting 1 from the length, since we have one less
  // duration than block.
  let avg = totalTime/(bc.length-1);
  console.log(`average time per block: ${avg}`)
  let stdDev = calcStdDev(avg, durations);
  console.log(`Standard deviation: ${stdDev}`);
}

let files = process.argv.slice(2);
files.forEach((f) => {
  let bc = parseJSON(f);
  printStats(bc);
});