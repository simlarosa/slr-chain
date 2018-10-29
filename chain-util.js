const EC = require('elliptic').ec; //require the ec class of the library elliptic that is a library of math critography
const ec = new EC('secp256k1'); //create a new instance of the EC class and use the secp256K1 critography that is the same of bitcoin
const uuidV1 = require('uuid/v1');
const SHA256 = require('crypto-js/sha256'); //we require sha256 function from library crypto-js

class ChainUtil { //define a class of chain utility

  static genKeyPair() { // define a static method that generates a keyPair objects
    return ec.genKeyPair();
  }

  static id(){
    return uuidV1();
  }

  static hash(data){
    return SHA256(JSON.stringify(data)).toString();
  }
}


module.exports = ChainUtil;
