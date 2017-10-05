const config = require('./config');
const EventEmitter = require('events').EventEmitter;
class Election extends EventEmitter{
  constructor(){
    super();
    this._timer;
  }

  startElection(){
    const self = this;
    self._timer = setInterval(function(){
      self.emit('election started');
    }, config.electionTimeout);
  }

  resetElection(){
    const self = this;
    if(self._timer) clearInterval(self._timer);
  }

  restartElection(){
    const self = this;
    resetElection.call(self);
    startElection.call(self);
  }
}

module.exports = new Election();