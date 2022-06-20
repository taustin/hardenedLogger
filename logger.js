"use strict";

const net = require('net');

const { Blockchain, Block, Client, Transaction, FakeNet } = require('spartan-gold');

const LoggingMiner = require('./logging-miner');

const DEBUG = 0;
const INFO = 1;
const WARN = 2;
const ERROR = 3;
const FATAL = 4;
const BLOCK_TIME = 5;

const DEFAULT_POW_LEADING_ZEROES = 20;

/**
 * This class listens for logging messages, and then writes them
 * to the blockchain by calling the LoggingMiner class.
 */
module.exports = class Logger {
  
  /**
   * Configures the logger.
   * 
   * @param {Object} params - Configuration for the logger.
   * @param {Number} params.level - Level of messages that should be printed out.
   * @param {Number} params.powLeadingZeroes - Difficulty level of mining blocks.
   * @param {Number} params.compromisedBlockNumber - Number of the first rewritten block.
   */
  constructor({level=WARN, powLeadingZeroes=DEFAULT_POW_LEADING_ZEROES, compromisedBlockNumber} = {}) {
    this.level = level;
    this.initializeBlockchain(powLeadingZeroes, compromisedBlockNumber);
  }

  /**
   * Start the server to listen for messages.
   * 
   * @param {Number} port - Number of the port to listen to for incoming messages.
   */
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

  /**
   * Initializes the miner and blockchain.
   * 
   * @param {Number} powLeadingZeroes - Difficulty of finding blocks.
   * @param {Number} compromisedBlockNumber - The number of the block after
   *   an attack on the blockchain.  If unspecified, there is no attack.
   */
  initializeBlockchain(powLeadingZeroes, compromisedBlockNumber) {
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

    // Set the compromised (first rewritten) block.
    this.miner.compromisedBlockNumber = compromisedBlockNumber;

    this.miner.initialize();
  }

  /**
   * Logs a message at the specified logging level.
   * The logging levels loosely follow Log4J.
   * 
   * @param {Number} level - Logging level.
   * @param {String} message - Message to be logged.
   */
  log(level, message) {
    //if (this.level <= level) {
    //  console.log(level, ": ", message);
    //}
    this.miner.postLoggingTransaction(level, message);
  }

  /**
   * Writes out a debug message.
   * 
   * @param {String} message - Logging message.
   */
  debug(message) {
    this.log(DEBUG, message);
  }

  /**
   * Writes an informational message.
   * 
   * @param {String} message - Logging message.
   */
  info(message) {
    this.log(INFO, message);
  }

  /**
   * Writes a warning message.
   * 
   * @param {String} message - Logging message.
   */
  warn(message) {
    this.log(WARN, message);
  }

  /**
   * Writes an error message.
   * 
   * @param {String} message - Logging message.
   */
  error(message) {
    this.log(ERROR, message);
  }

  /**
   * Writes a fatal error message.
   * 
   * @param {String} message - Logging message.
   */
  fatal(message) {
    this.log(FATAL, message);
  }
}

