const Block = require('./block');
const {DIFFICULTY} = require('../config');
//We will use jest to run the test and this is the way to write a test:

describe('Block', () =>{ //describe is the method the create a Test and in this case we called Block
let data, lastBlock, block; //we declare the variable to be use in each function/test

  beforeEach(() => { //before each is a function that receive a arrow function that do something before each test
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('sets the `data` to match the input', () => { //it is the way to declare a test and you can describe with a string te test and make it with an array function
    expect(block.data).toEqual(data); //expect and toEqual are needed to declare what we expect and what is equal and compare it
  });

  it('sets the `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    console.log(block.toString());
  });

  it('lowes the difficulty for slowly mined blocks', ()=> {
   expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty-1);
  });

  it('raises the difficulty for quickly mined blocks', ()=> {
   expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1);
  });
});
