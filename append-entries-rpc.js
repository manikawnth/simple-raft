
const state = require('./state');
const config = require('./config');

function onAppendEntries(call, cb){
  let appendReq = call.request;
  let response = {term: state.currentTerm, success: true}

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
    response['term'] = state.currentTerm;
    response['success'] = true;
    cb(null, response);
  }
}


function appendEntries(clientIdents){
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