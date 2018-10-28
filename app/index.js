const express = require('express'); //richediamo il modulo express, body parser e blockchain
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001; //definiamo la porta HTTP che può essere o definita dal terminale o è la 3001

const app = express(); //dichiariamo l'oggetto app che è express
const bc = new Blockchain(); //dichiariamo un'istanza della Blockchain
const p2pServer = new P2pServer(bc);

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

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`)); //Asscoltiamo nell pota 3001
p2pServer.listen();
