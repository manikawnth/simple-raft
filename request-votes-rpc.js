
const state = require('./state');
const config = require('./config');

//when other peers request for votes
//Send a vote response only if you're follower
function onRequestVotes(call, cb){
  let voteReq = call.request;
  let grantResp = {term: state.currentTerm, voteGranted: true}
  let denyResp = {term: state.currentTerm, voteGranted: false}
  if(!state.isFollower()){
    cb(null, denyResp);
  }
  if(voteReq.term < state.currentTerm){ //reject if the term is less than current
    cb(null, denyResp);
  }else if(voteReq.term > state.currentTerm){
    state.toFollower(voteReq.term)
    cb(null, grantResp);
  }else{
    if(state.votedFor && state.votedFor != config.me){
      cb(null, denyResp);
    }else{
      cb(null, grantResp);      
    }    
  }
}

//request for votes and process the response
function requestVotes(clientIdents){
  for (let client of clientIdents){
    let req = {term: state.currentTerm, candidateId: config.me};
    let voteCountClosure = 0;

    client.requestVotes(req, function(err,resp){      
      if(!err){
        if(resp.term > state.currentTerm){
          state.toFollower(resp.term);
        }else{
          voteCountClosure++;
          if(voteCountClosure >= config.majorityVotes) state.toLeader();
        }
      }            
    })
  }
}

module.exports = {requestVotes, onRequestVotes};