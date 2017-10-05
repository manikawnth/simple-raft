const debug = require('debug')('server');
const config = require('./config');
const state = require('./state');
const {onRequestVotes, requestVotes} = require('./request-votes-rpc');
const {onAppendEntries, appendEntries} = require('./append-entries-rpc');
config.me = process.argv[2];
//get the grpc transporter

const transporter = require('./transporter');

//bind the transporter with the options
const bindOptions = {
  bindAddress : config.me,
  rpc:{
    'requestVotes':onRequestVotes,
    'appendEntries':onAppendEntries
  }
}

debug('starting transporter...')
transporter.bind(bindOptions);

//state events
state.on('became-follower', function(){
  clearInterval(state._heartBeatsTimer);
});

state.on('became-candidate', function(){
  clearInterval(state._heartBeatsTimer);
  requestVotes();
});
state.on('became-leader', function(){
  state._heartBeatsTimer = setInterval(()=>{
    appendEntries();
  },1000)
});

//start as a follower
debug('converting to follower...')
state.toFollower();