//const election = require('./election');
const config = require('./config');
const {requestVotes} = require('./request-votes-rpc');
const {appendEntries} = require('./append-entries-rpc');

class State{
  constructor(){
    const self = this;
    self.currentTerm = 1;
    self.votedFor = '';
    self.role = 'follower';

    self._electionTimer;
  }

  _startElectionTimeout(){
    const self = this;
    const timeout = config.electionTimeout + (Math.random() * config.electionTimeout);
    self._electionTimer = setInterval(function(){
      self.toCandidate();
    }, config.electionTimeout)
  }

  _stopElectionTimeout(){
    const self = this;
    clearInterval(self._electionTimer);
  }

  _restartElectionTimeout(){
    const self = this;
    _stopElection.call(self);
    _startElection.call(self);
  }

  isFollower(){
    return (state.role == 'follower')
  }

  isCandidate(){
    return (state.role == 'candidate')
  }

  isLeader(){
    return (state.role == 'leader')
  }

  
  toFollower(term){
    const self = this;
    self.role = 'follower';
    term ? (state.currentTerm = term) : (state.currentTerm = 1);
    self._restartElectionTimeout();
  }

  toCandidate(){
    const self = this;
    self.role = 'candidate';
    self.currentTerm ++;
    self.votedFor = config.me;
    self._restartElectionTimeout();
    //request for votes
    requestVotes();
  }

  toLeader(){
    const self = this;
    self.role = 'leader';
    self._stopElectionTimeout();
    appendEntries();
  }

}

module.exports = new State();