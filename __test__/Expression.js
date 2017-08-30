const {Expression} = require('../lib/Expression');

// console.log();
const result = Expression('1{{ a+1 }}12122121');

console.log(JSON.stringify(result, null, 4));