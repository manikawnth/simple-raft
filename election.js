//Only rule is election timer will not run for Leaders
let electionTimer;

function startElection(){
  //this timer will be cleared if there are regular heartbeats.
  electionTimer = setInterval(function(){
    //transition to candidate
    state.toCandidate();
  },1000);

}

function resetElection(){
  if (electionTimer){
    clearInterval(electionTimer);
  }
}

function restartElection(){
  resetElection();
  startElection();
}

module.exports = {startElection,resetElection,restartElection};