"use strict";

const { Blockchain, Block, Client, Miner, Transaction, FakeNet } = require('spartan-gold');

module.exports = class LoggingMiner extends Miner {

  startNewSearch(txSet=new Set()) {
    super.startNewSearch(txSet);
    let tx = Blockchain.makeTransaction({
      from: this.address,
      nonce: this.nonce++,
      pubKey: this.keyPair.public,
      outputs: [],
      data: {
        level: 5,
        time: Date.now(),
      },
    });
    tx.sign(this.keyPair.private);
    this.currentBlock.addTransaction(tx);
  }

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

  receiveBlock(block) {
    block = super.receiveBlock(block);
    if (block === null) return null;

    console.log(`{"${block.id}":`);
    console.log(block.serialize());
    console.log("},");

    /*block.transactions.forEach((tx) => {
      let d = tx.data;
      let date = new Date(d.time);
      let lvl = this.translateLevel(d.level);
      console.log(`${tx.id} (${lvl} ${date.toISOString()}): ${d.message}`);
    });*/

   return block;
  }
}
