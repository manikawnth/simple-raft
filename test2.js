const state = require('./state');

exports.incTerm = function(){
  state.currentTerm++;
}