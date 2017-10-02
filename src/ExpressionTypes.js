const COMPOUND = 'Compound',
    IDENTIFIER = 'Identifier',
    MEMBER_EXP = 'MemberExpression',
    LITERAL = 'Literal',
    THIS_EXP = 'ThisExpression',
    CALL_EXP = 'CallExpression',
    UNARY_EXP = 'UnaryExpression',
    BINARY_EXP = 'BinaryExpression',
    LOGICAL_EXP = 'LogicalExpression',
    CONDITIONAL_EXP = 'ConditionalExpression',
    ARRAY_EXP = 'ArrayExpression';

function createBinaryExpression(operator, left, right) {
    var type = (operator === '||' || operator === '&&') ? LOGICAL_EXP : BINARY_EXP;
    return {
        type: type,
        operator: operator,
        left: left,
        right: right
    };
}

function createCompound(body) {
    return {
        type: COMPOUND,
        body
    };
}

function createLiteral(value, raw) {
    return {
        type: LITERAL,
        value,
        raw
    };
}

function createThisExpression() {
    return {
        type: THIS_EXP
    };
}

function createCallExpression(args, callee) {
    return {
        type: CALL_EXP,
        arguments: args,
        callee
    };
}

function createIdentifier(identifier) {
    return {
        type: IDENTIFIER,
        name: identifier,
    };
}

function createMemberExpression(computed, object, property) {
    return {
        type: MEMBER_EXP,
        computed,
        object,
        property: property
    };
}

function createArrayExpression(elements) {
    return {
        type: ARRAY_EXP,
        elements: elements
    };
}

function createConditionalExpression(test, consequent, alternate) {
    return {
        type: CONDITIONAL_EXP,
        test,
        consequent,
        alternate
    };
}

function createUnaryExpression(operator, argument, prefix) {
    return {
        type: UNARY_EXP,
        operator,
        argument,
        prefix
    };
}

exports.createConditionalExpression = createConditionalExpression;
exports.createArrayExpression = createArrayExpression;
exports.createMemberExpression = createMemberExpression;
exports.createIdentifier = createIdentifier;
exports.createCallExpression = createCallExpression;
exports.createThisExpression = createThisExpression;
exports.createLiteral = createLiteral;
exports.createCompound = createCompound;
exports.createBinaryExpression = createBinaryExpression;
exports.createUnaryExpression = createUnaryExpression;

exports.Types = {
    COMPOUND,
    IDENTIFIER,
    MEMBER_EXP,
    LITERAL,
    THIS_EXP,
    CALL_EXP,
    UNARY_EXP,
    BINARY_EXP,
    LOGICAL_EXP,
    CONDITIONAL_EXP,
    ARRAY_EXP
};