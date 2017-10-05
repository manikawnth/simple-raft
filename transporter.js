const grpc = require('grpc');
const config = require('./config');

class Transporter {
  
  constructor(protoFile){
    console.log("constructing transporter...");
    this._server;
    //load the protofile, Point the 'RPC' service object
    this._rpcProto = grpc.load(protoFile);
    this._clients = [];
  }

  //options- {bindAddress:'0.0.0.0:50551', rpc:{requestVotes:onRequestVotes, otherRPC:onOtherRPC}}
  bind(options) {
    const self = this;
    self._server = new grpc.Server();

    self._server.addService(self._rpcProto['RPC']['service'], options.rpc);  

    self._server.bind(options.bindAddress, grpc.ServerCredentials.createInsecure())

    //add each rpc callbacks
    /*
    for (let rpc_name in options.rpc){
      let rpc_handler = options.rpc[rpc_name];
      self._server.addService(self._rpcService, {rpc_name: rpc_handler});  
    }
    */
    console.log("transporter starting...");
    //start the grpc server
    self._server.start();

    //client idents
    console.log("gathering client idents...");
    for (let peer of config.nodes){
      if (peer != config.me){
        let client = new self._rpcProto['RPC'](peer,grpc.credentials.createInsecure());
        self._clients.push(client);
      }
    }
    
  } 

}

module.exports = new Transporter('rpc.proto');