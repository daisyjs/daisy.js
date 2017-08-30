const {Expression} = require('../lib/Expression');

// console.log();
const result = Expression('1{{ a+1 }}12122121');
const result1 = Expression('{{ a+1 }}');

console.log(JSON.stringify(result, null, 4));
console.log(JSON.stringify(result1, null, 4));