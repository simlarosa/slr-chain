const ChainUtil = require('../chain-util'); //require the chain util class
const { INITIAL_BALANCE } = require('../config'); //require the initial balance const


class Wallet { //create a Wallet object
  constructor(){ //the constructor define the balance, the Key pair and the public key
    this.balance = INITIAL_BALANCE; //define the balance
    this.keyPair = ChainUtil.genKeyPair(); //take the keypair from the ChainUtil object and his own method
    this.publicKey = this.keyPair.getPublic().encode('hex'); //take the public key from the key public and encode it in hex
  }

  toString(){ //a toString version of the wallet attributes
    return `Wallet -
    publicKey: ${this.publicKey.toString()}
    balance  : ${this.balance}`
  }

  sign(dataHash) { //the sign method that take an hash as attributes
    return this.keyPair.sign(dataHash); //ritorna il sign method of the library ec
  }
}

module.exports = Wallet;
