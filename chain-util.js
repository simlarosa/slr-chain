const EC = require('elliptic').ec; //require the ec class of the library elliptic that is a library of math critography
const ec = new EC('secp256k1'); //create a new instance of the EC class and use the secp256K1 critography that is the same of bitcoin

class ChainUtil { //define a class of chain utility
  static genKeyPair() { // define a static method that generates a keyPair objects
    return ec.genKeyPair();
  }
}

module.exports = ChainUtil;
