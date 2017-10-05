const debug = require('debug')('request-votes');
const state = require('./state');
const config = require('./config');
const transporter = require('./transporter');
debug(state.role);
//when other peers request for votes
//Send a vote response only if you're follower
function onRequestVotes(call, cb){
  debug('received vote request');
  let voteReq = call.request;
  let grantResp = {term: state.currentTerm, voteGranted: true}
  let denyResp = {term: state.currentTerm, voteGranted: false}
  if(!state.isFollower()){
    debug('i am not follower. cannot vote. denying the vote');
    cb(null, denyResp);
    return;
  }
  if(voteReq.term < state.currentTerm){ //reject if the term is less than current
    debug('i got the highest term. denying the vote');
    cb(null, denyResp);
  }else if(voteReq.term > state.currentTerm){
    debug('others term is higher. granting the vote. converting to follower');
    state.toFollower(voteReq.term)
    cb(null, grantResp);
  }else{
    if(state.votedFor && state.votedFor != config.me){
      debug('already voted in this term. denying the vote');
      cb(null, denyResp);
    }else{
      debug('terms are same. granting the vote');
      cb(null, grantResp);      
    }    
  }
}

//request for votes and process the response
function requestVotes(){
  debug('requesting votes');
  let clientIdents = transporter._clients;
  let voteCountClosure = 1;
  for (let client of clientIdents){
    let req = {term: state.currentTerm, candidateId: config.me};

    client.requestVotes(req, function(err,resp){      
      if(!err){
        if(resp.term > state.currentTerm){
          debug('others term is higher. converting to follower');
          state.toFollower(resp.term);
        }else{
          voteCountClosure++;
          debug("current votes: %d, current term: %d", voteCountClosure, state.currentTerm);
          if(voteCountClosure >= config.majorityVotes) {
            state.toLeader()
          };
        }
      }            
    })
  }
}

module.exports = {requestVotes, onRequestVotes};