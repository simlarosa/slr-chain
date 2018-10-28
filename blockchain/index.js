const Block = require('./block'); //we need the block class

class Blockchain { //define a new class
  constructor() {
    this.chain = [Block.genesis()]; //we initizialize the blockchain by define an attribute called chain that is an array and contains the genesis block
  }

  addBlock(data) { //we declare the addBlock method that have in input the data
    const block = Block.mineBlock(this.chain[this.chain.length-1], data); //we create a new block
    this.chain.push(block); //we push the block on the chain

    return block;
  }

  isValidChain(chain) { //Look at the chain and see if is valid, can return true or false
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false; //We transform object in string for compare it, if the genesis block is altered the chain is invalid

    for(let i=1; i<chain.length; i++) { //we iterate trough the block for validation
      const block = chain[i]; //we assign to variable block, each block of the chain by i
      const lastBlock = chain[i-1]; //we assign the previous block

      if(block.lastHash !== lastBlock.hash ||  block.hash !== Block.blockHash(block)){ // we verify if the lastHash in the current block is not equal to the hash of the previous one and also we rehash the block to see if the data are altered
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain){
    if(newChain.length <= this.chain.length){ //We see if the length of the new chain length is minor of current chain
      console.log('Received chain is not longer than the current chain.');
      return;
    } else if(!this.isValidChain(newChain)) { //Wee see if the chain is valid
      console.log('The received chain is not valid.');
      return;
    }
  console.log('Replacing blockchain with the new chain. ');
  this.chain = newChain; //We replace the blockchain  
  }
}

module.exports = Blockchain;
