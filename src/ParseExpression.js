const jsep = require('../lib/jsep');

function ParseExpression(source) {
    return jsep(source);
}

exports.ParseExpression = ParseExpression;
