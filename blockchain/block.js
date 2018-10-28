/* Create the elemental unit of the blockchain
A block contains:
  - Timestamp in milliseconds
  - lastHash: the hash of the block before
  - hash based on its own Data
  - the data to store

We code a Block as a class */

const SHA256 = require('crypto-js/sha256'); //we require sha256 function from library crypto-js
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block {  //create a class model called Block
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) { // We initizialize a class by the constructor and declare the attributes
    this.timestamp = timestamp; //We assign the attributes give to the constructor to the instance attributes of the class
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() { //we create a method needed for returing all the attributes of a given instance of the class
    return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}
        Data      : ${this.data}`; //substring method is used to limit the number of the Hash to display
  }

  static genesis() { //By putting static identifier we can called the method without making a new instance of the Block
    return new this('Genesis time','-------', 'f1r57-h4sh', 'This block is property of Simone La Rosa', 0, DIFFICULTY); //This return a new instance of the class
  }

  static mineBlock(lastBlock, data) { //We create a static method that have the purpose of create new block and needs as attribute lastBlock and data
    let hash, timestamp;
    const lastHash = lastBlock.hash; //Take the hash of the lastBlock
    let { difficulty } = lastBlock;
    let nonce = 0;

    do{
      nonce++;
      timestamp = Date.now();  //As timestamp we use js library calle Date and his method now that return in milliseconds the time pass from 1 January 1970
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp,lastHash, data, nonce, difficulty); //we create the hash thanks to the hash method in the class
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty); //this create a new instance of the block
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) { //we create an hash function that combine timestamp and lastHash and data for create the Hash
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString(); //calling SHA256 function of the crypto-js library
  }

  static blockHash(block){ //receive a block and calculate is own hash base on the data inside it
    const {timestamp, lastHash, data, nonce, difficulty} = block; //put the attribute equal to the own of the block
    return Block.hash(timestamp, lastHash, data, nonce,difficulty); //The hash function
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block; //This is exports the class Block as a module reusable in other js documents.
