const express = require('express'); //richediamo il modulo express, body parser e blockchain
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require ('../wallet'); //include the wallet class
const TransactionPool = require('../wallet/transaction-pool'); //include transaction poll class

const HTTP_PORT = process.env.HTTP_PORT || 3001; //definiamo la porta HTTP che può essere o definita dal terminale o è la 3001

const app = express(); //dichiariamo l'oggetto app che è express
const bc = new Blockchain(); //dichiariamo un'istanza della Blockchain
const wallet = new Wallet(); //declare an instance of the wallet
const tp = new TransactionPool(); //declare an instance of the TransactionPool
const p2pServer = new P2pServer(bc, tp);

app.use(bodyParser.json()); //utilizziamo il bodyParser per ricevere risposte in POST in formato JSON

app.get('/blocks', (req, res) => { //dichiariamo un API get
  res.json(bc.chain); //come risposta forniamo tutta la chain in formato json
});

app.post('/mine', (req, res) => { //dichiariamo un API post
  const block = bc.addBlock(req.body.data); //definiamo block come un aggiungere un blocco e prendendo dalla richiesta il campo data
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect('/blocks'); //rindirizziamo alla chiamata GET
});

app.get('/transactions', (req, res)=> { //create a get API for see all the transactions in a pool
  res.json(tp.transactions); //give as response a json form of the transactions in the transaction pool
});

app.post('/transact', (req, res) => { //create a post API to make a transaction
  const { recipient, amount } = req.body; //declare the request body and take the data
  const transaction = wallet.createTransaction(recipient, amount, tp); //create the transaction from the wallet
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions'); //redirect to see the transaction
});

app.get('/public-Key', (req, res)=> {
  res.json({ publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`)); //Asscoltiamo nell pota 3001
p2pServer.listen();
