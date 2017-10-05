const state = require('./state');

state.currentTerm++;
console.log(state);

const test2 = require('./test2');

test2.incTerm();

console.log(state);