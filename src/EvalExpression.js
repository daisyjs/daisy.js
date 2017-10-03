function EvalExpression(expression, {state, methods}) {
    const expr = codeGen(expression);
    const variables = Object.keys(state);
    const methodNames = Object.keys(methods);
    const content = `${variables.map((variable) => `
        const ${variable} = state['${variable}'];
    `).join('')}

    ${methodNames.map((methodName) => `
        const ${methodName} = methods['${methodName}'];
    `).join('')}
    return ${expr};`;

    const codeFn = new Function('state', 'methods', content);

    return codeFn(state, methods);
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
            return `${callee}(${args.join(',')})`
        default:
            console.log('unexpected expression:');
            console.log(JSON.stringify(expression));
    }
}

export {
    EvalExpression, codeGen
}
