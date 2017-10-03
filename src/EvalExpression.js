function EvalExpression(expression, {state, methods}) {
    const expr = codeGen(expression);
    const content = `
        with(context) {
            return ${expr};
        }
    `;

    const codeFn = new Function('context', content);
    try {
        return codeFn(Object.assign({}, methods, state));
    } catch(e) {
        if (e instanceof ReferenceError) {
            throw new Error('Error in EvalExpression: \n expression ' + e.message);
        }
        throw new Error('Error in EvalExpression: \n' + e.message);
    }
}

function codeGen(expression) {
    const {type} = expression;

    switch (type) {
    case 'Expression':
        return codeGen(expression.value);
    case 'Identifier':
        return expression.name;
    case 'BinaryExpression':
        const left = codeGen(expression.left);
        const right = codeGen(expression.right);
        return `${left}${expression.operator}${right}`;
    case 'MemberExpression':
        const object = codeGen(expression.object);
        const property = codeGen(expression.property);
        return `${object}['${property}']`;
    case 'Literal':
        return expression.value;
    case 'CallExpression':
        const callee = codeGen(expression.callee);
        const args = expression.arguments.map(codeGen);
        return `${callee}(${args.join(',')})`;
    default:
        console.log('unexpected expression:');
        console.log(JSON.stringify(expression));
    }
}

export {
    EvalExpression, codeGen
};
