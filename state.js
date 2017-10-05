const debug = require('debug')('state');
const EventEmitter = require('events').EventEmitter;
const config = require('./config');
//const {requestVotes} = require('./request-votes-rpc');
//const {appendEntries} = require('./append-entries-rpc');

class State extends EventEmitter{
  constructor(){
    super();
    const self = this;
    self.currentTerm = 1;
    self.votedFor = '';
    self.role = 'follower';

    self._electionTimer;
    self._heartBeatsTimer;
  }

  _startElectionTimeout(){
    const self = this;
    debug('starting election timeout, term: %d', self.currentTerm);
    const timeout = config.electionTimeout + (Math.random() * config.electionTimeout);
    self._electionTimer = setInterval(function(){
      self.toCandidate();
    }, config.electionTimeout)
  }

  _stopElectionTimeout(){
    debug('stopping election timeout');
    const self = this;
    clearInterval(self._electionTimer);
  }

  _restartElectionTimeout(){
    const self = this;
    self._stopElectionTimeout();
    self._startElectionTimeout();
  }

  isFollower(){
    const self = this;
    return (self.role == 'follower')
  }

  isCandidate(){
    const self = this;
    return (self.role == 'candidate')
  }

  isLeader(){
    const self = this;
    return (self.role == 'leader')
  }

  
  toFollower(term){
    debug('converting to follower...');
    const self = this;
    self.role = 'follower';
    term ? (self.currentTerm = term) : (self.currentTerm = 1);
    self._restartElectionTimeout();
    self.emit('became-follower');
  }

  toCandidate(){
    debug('converting to candidate...');
    const self = this;
    self.role = 'candidate';
    self.currentTerm ++;
    self.votedFor = config.me;
    self._restartElectionTimeout();
    //request for votes
    self.emit('became-candidate');
    //requestVotes();
  }

  toLeader(){
    debug('converting to leader...');
    const self = this;
    self.role = 'leader';
    self._stopElectionTimeout();
    self.emit('became-leader');
    //appendEntries();
  }

}

module.exports = new State();