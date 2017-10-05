const zmq = require('zeromq');
const peers = [
  'tcp://127.0.0.1:3000',
  'tcp://127.0.0.1:3001',
  'tcp://127.0.0.1:3002'
];

const me = process.argv[2];

class Transporter {
  constructor() {
    console.log("transporter constructing...");
    this.bindSocket;
    this.connectSockets = [];
    this.activeRPCs = [];
  }

  start() {
    const self = this;

    let sock = zmq.socket('pub');
    sock.bindSync(me);
    self.bindSocket = sock;

    for (let peer of peers) {
      if (peer != me) {
        let sock = zmq.socket('sub');
        sock.connect(peer);
        self.connectSockets.push(sock);
      }
    }
  }

  send(topic, msg){
     const self = this;
     self.bindSocket.send([topic, msg]);
  }

}

module.exports = new Transporter();