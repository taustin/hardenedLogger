"use strict";

const { Blockchain, Block, Client, Miner, Transaction, FakeNet } = require('spartan-gold');

// The logging level for the block timestamp transaction.
const BLOCK_TIME_LEVEL = 5;

/**
 * This miner makes blocks of transactions where every
 * transaction is a logging message.
 */
module.exports = class LoggingMiner extends Miner {

  /**
   * This method is called whenever a new block is
   * created.  For our logging framework, every block
   * contains an additional transaction indicating
   * the time when the search for the proof begins.
   * 
   * @param {Set<Transaction>} txSet 
   */
  startNewSearch(txSet=new Set()) {
    if (!!this.currentBlock && this.compromisedBlockNumber === this.currentBlock.chainLength) {
      // Here we simulate an attacker attempting to delete
      // or change history, and then needing to rewrite the
      // corresponding blocks.
      setTimeout(() => {
        this.startNewSearch(txSet);
      }, this.compromiseDuration);

      // After the compromise, the blockchain continues as normal.
      delete this.compromisedBlockNumber;
      return;
    }

    super.startNewSearch(txSet);
    let tx = Blockchain.makeTransaction({
      from: this.address,
      nonce: this.nonce++,
      pubKey: this.keyPair.public,
      outputs: [],
      data: {
        level: BLOCK_TIME_LEVEL,
        time: Date.now(),
      },
    });
    tx.sign(this.keyPair.private);
    this.currentBlock.addTransaction(tx);
  }

  /**
   * Writes a log message to a transaction and broadcasts it to
   * the mining network.  (In our initial architecture, the miner
   * is the only client and the only miner.)
   * 
   * @param {Number} level - Level of the logging message, ranging from 0-4.
   * @param {String} message - The log message.
   */
  postLoggingTransaction(level, message) {
    this.postGenericTransaction({
      outputs: [],
      fee: 0,
      data: {
        level: level,
        message: message,
        time: Date.now(),
      }
    });
  }

  // Silencing the normal logging messages.
  log(msg) {
    //if (msg.startsWith("cutting") || msg.startsWith("found")) return;
    //super.log(msg);
  }

  translateLevel(lvl) {
    switch(lvl) {
      case 0: return "DEBUG";
      case 1: return "INFO";
      case 2: return "WARN";
      case 3: return "ERROR";
      case 4: return "FATAL";
      case 5: return "BLOCK_TIME";
      default: return "UNKNOWN LOG LEVEL";
    }
  }

  /**
   * This method validates the block of transactions
   * (by calling the superclass's version of this method)
   * and then prints out the block to standard output.
   * 
   * The format of the output is JSON, with an additional
   * comma at the end.
   * 
   * @param {Block} block - Block of transactions.
   * 
   * @returns {Block} - The block of transactions, or null
   *   if the block was invalid
   */
  receiveBlock(block) {
    block = super.receiveBlock(block);
    if (block === null) return null;

    console.log(`{"${block.id}":`);
    console.log(block.serialize());
    console.log("},");

   return block;
  }
}
