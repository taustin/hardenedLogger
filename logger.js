"use strict";

const net = require('net');

const { Blockchain, Block, Client, Transaction, FakeNet } = require('spartan-gold');

const LoggingMiner = require('./logging-miner');
const LoggingBlock = require('./logging-block');

const DEBUG = 0;
const INFO = 1;
const WARN = 2;
const ERROR = 3;
const FATAL = 4;
const BLOCK_TIME = 5;

const DEFAULT_POW_LEADING_ZEROES = 20;

module.exports = class Logger {
  constructor({level=WARN, powLeadingZeroes=DEFAULT_POW_LEADING_ZEROES} = {}) {
    this.level = level;
    this.initializeBlockchain(powLeadingZeroes);
  }

  startServer(port) {
    let srvr = net.createServer();
    srvr.on('connection', (client) => {
      client.on('data', (data) => {
        let ds = data.toString();
        let lvl = parseInt(ds.charAt(0));
        let msg = ds.slice(1);
        this.log(lvl, msg);
      });
    });
    srvr.listen(port);
  }

  initializeBlockchain(powLeadingZeroes) {
    let fakeNet = new FakeNet();
    this.miner = new LoggingMiner({name: "BlockLogger", net: fakeNet});

    Blockchain.makeGenesis({
      blockClass: Block,
      transactionClass: Transaction,
      powLeadingZeroes: powLeadingZeroes,
      clientBalanceMap: new Map([
        [this.miner, 10000],
      ]),
    });
    fakeNet.register(this.miner);

    this.miner.initialize();
  }

  log(level, message) {
    //if (this.level <= level) {
    //  console.log(level, ": ", message);
    //}
    this.miner.postLoggingTransaction(level, message);
  }

  debug(message) {
    this.log(DEBUG, message);
  }

  info(message) {
    this.log(INFO, message);
  }

  warn(message) {
    this.log(WARN, message);
  }

  error(message) {
    this.log(ERROR, message);
  }

  fatal(message) {
    this.log(FATAL, message);
  }
}

