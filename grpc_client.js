const grpc = require('grpc');

var PROTO_PATH = __dirname + '/rpc.proto';

var rpc_proto = grpc.load(PROTO_PATH);

function main(){
  let req = {term:1, candidateId:'hello'};

  var client = new rpc_proto.RPC('localhost:50051',grpc.credentials.createInsecure())
  let stime = new Date().getTime();
  client.requestVotes(req, function(err,resp){
    let timespan = (new Date().getTime()) - stime;
    console.log('Total time took is: ' + timespan + 'ms');
    console.log('\u2665');
    console.log(err);
    console.log(resp);
  })
}

main();