var config = {
  "nodes" : [
    "localhost:40401",
    "localhost:40402",
    "localhost:40403"
  ],
  "me" : "localhost:40401",
  "grpcOptions":{
    "bindAddress" : "0.0.0.0:40401",
    "rpc" : {
      
    }
  },
  "majorityVotes" : 2
}

module.exports = config;