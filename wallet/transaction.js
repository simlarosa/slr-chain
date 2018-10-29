const ChainUtil = require('../chain-util'); //require the chain util
const { MINING_REWARD } = require('../config');

class Transaction { //create a Transaction object
  constructor() {
    this.id = ChainUtil.id(); //Take the id from the Chain util that use a method for create a id based on uuid module
    this.input = null; //input for now is null
    this.outputs = []; //create an output that is a empy array
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient});
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
      const transaction = new this(); //create an instance of transaction
      transaction.outputs.push(...outputs);
      Transaction.signTransaction(transaction, senderWallet); //sign the Transaction by called the method
      return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) { //static method newTransaction that needs the address of the sender wallet, the address of the recipient, and the amount that needs to be transfer
    if(amount > senderWallet.balance) { //check if the amount is higher than the balance
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [ //create the outputs as an array of objects
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet){
    return Transaction.transactionWithOutputs(blockchainWallet, [{
      amount: MINING_REWARD, address: minerWallet.publicKey
    }]);
  }

  static signTransaction(transaction, senderWallet) { //static method for sign a transaction by know the transaction and the senderWallet
    transaction.input = { //modify the input part of the transaction
      timestamp: Date.now(), //add the timestamp
      amount: senderWallet.balance, //the balance of the senderWallet
      address: senderWallet.publicKey, //the publicKey
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)) //sign the stransaction with the hash of the outputs of the transaction
    }
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
