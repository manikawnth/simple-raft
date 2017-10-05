const config = require('./config');
const state = require('./state');
const {onRequestVotes} = require('./request-votes-rpc');
const {onAppendEntries} = require('./append-entries-rpc');

//get the grpc transporter
const transporter = require('./transporter');

//bind the transporter with the options
const bindOptions = {
  bindAddress : config.bindAddress,
  rpc:{
    'requestVotes':onRequestVotes,
    'appendEntries':onAppendEntries
  }
}

transporter.bind(bindOptions);

//start as a follower
state.toFollower();