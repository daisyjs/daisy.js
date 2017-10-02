const {Expression} = require('../src/Expression');

// console.log();
// const result = Expression('1{{ a+1 }}12122121');
// const result1 = Expression('{{ a+1 }}');
// const result2 = Expression('{{ a?1:0 }}');
// const result3 = Expression('a,,,');
const result4 = Expression('a==1');

// console.log(JSON.stringify(result, null, 4));
// console.log(JSON.stringify(result1, null, 4));
// console.log(JSON.stringify(result2, null, 4));
// console.log(JSON.stringify(result3, null, 4));
console.log(JSON.stringify(result4, null, 4));
