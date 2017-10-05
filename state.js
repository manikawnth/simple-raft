const election = require('./election');

class State{
  constructor(){
    this.currentTerm = 1;
    this.votedFor = '';
    this.role = 'follower';

    this.electionTimer = null;
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
    state.currentTerm = term;
    election.restartElection();
  }

  toCandidate(){
    state.currentTerm ++;
    state.votedFor = config.me;
    election.restartElection();
  }

  toLeader(){
    
  }

}

module.exports = new State();