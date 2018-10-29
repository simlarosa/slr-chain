/* ---------TESTING THE BLOCK MINING----------*/

const Blockchain = require('./blockchain');

const bc = new Blockchain();

for (let i=0; i<101; i++) {
  console.log(bc.addBlock(`PIXA n.${i}`).toString());
}



const Wallet = require('./wallet');
const wallet = new  Wallet();
console.log(wallet.toString());
