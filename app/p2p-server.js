const Websocket = require('ws'); //require a ws library

const P2P_PORT = process.env.P2P_PORT || 5001; //we define a port
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; //we define also PEERS constant
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION'
};

class P2pServer { //create a P2pServer class
  constructor(blockchain, transactionPool) { //the constructor needs a blockchain as an attribute
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = []; //we declare an array of sockets
  }

  listen() { //listen method
    const server = new Websocket.Server({ port: P2P_PORT }); //we declare a new instance of WebSocket that is a server on the P2P_PORT
    server.on('connection', socket => this.connectSocket(socket)); //from the server we connect to the socket

    this.connectToPeers(); //We connect to all the others Peer
    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }


  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');

    this.messageHandler(socket);

    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
      }
    });
  }

  sendChain(socket) {
      socket.send(JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      }));
    }

    sendTransaction(socket, transaction) {
      socket.send(JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction
      }));
    }


    syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

}

module.exports = P2pServer;
