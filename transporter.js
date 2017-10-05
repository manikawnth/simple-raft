const grpc = require('grpc');
const config = require('config');

class Transporter {
  
  constructor(protoFile){
    console.log("constructing transporter...");
    this._server;
    //load the protofile, Point the 'RPC' service object
    this._rpcService = grpc.load(protoFile).RPC.service;
    this._clients = [];
  }

  //options- {bindAddress:'0.0.0.0:50551', rpc:{requestVotes:onRequestVotes, otherRPC:onOtherRPC}}
  bind(options) {
    const self = this;
    self._server = new grpc.Server();
    self._server.bind(options.bindAddress, grpc.ServerCredentials.createInsecure())

    //add each rpc callbacks
    for (let rpc_name in options.rpc){
      let rpc_handler = options.rpc[rpc_name];
      self._server.addService(self._rpcService, {rpc_name: rpc_handler});  
    }
    console.log("transporter starting...");
    //start the grpc server
    self._server.start();

    //client idents
    console.log("gathering client idents...");
    for (let peer of config.nodes){
      if (peer != config.me){
        let client = new rpc_proto.RPC(peer,grpc.credentials.createInsecure());
        self._clients.push(client);
      }
    }
    
  } 

}

module.exports = Transporter;