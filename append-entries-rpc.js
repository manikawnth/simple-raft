const debug = require('debug')('append-entries');
const state = require('./state');
const config = require('./config');
const transporter = require('./transporter');

function onAppendEntries(call, cb){
  let appendReq = call.request;
  let response = {term: state.currentTerm, success: true}
  debug('got a heartbate from leader');
  debug(state.isFollower());
  if(state.isFollower()){
    if(appendReq.term < state.currentTerm){
      response['term'] = state.currentTerm;
      response['success'] = false;
      cb(null, response);
    }else if (appendReq.term > state.currentTerm){
      state.toFollower(appendReq.term);
      response['term'] = state.currentTerm;
      response['success'] = true;
      cb(null, response);
    }else{
      state.toFollower(appendReq.term);
      response['term'] = state.currentTerm;
      response['success'] = true;
      cb(null, response);
    }
  }else{
    response['term'] = state.currentTerm;
    response['success'] = false;
    cb(null, response)
  }
}


function appendEntries(){
  let clientIdents = transporter._clients;
  debug('sending heartbeats...');
  for (let client of clientIdents){
    let req = {term: state.currentTerm, leaderId: config.me};
    let voteCountClosure = 0;
    client.appendEntries(req, function(err,resp){
      
      if(!err){
        if(resp.term > state.currentTerm){
          state.toFollower(resp.term);
        }
      }      
      
    })
  }
}

module.exports = {appendEntries, onAppendEntries};