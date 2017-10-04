import {warn} from './helper';

const expressionMap = new Map();

function EvalExpression(expression, {state, methods, context}) {
    // cache expression
    if (!expressionMap.get(expression)) {
        const expr = codeGen(expression);
        const content = `
            with(context) {
                return ${expr};
            }
        `;
        expressionMap.set(expression, new Function('context', content));
    }

    const codeFn = expressionMap.get(expression);
    // try {
    return codeFn.call(context, Object.assign({}, methods, state));
    // } catch(e) {
    //     if (e instanceof ReferenceError) {

    //         warn('Error in EvalExpression: expression ' + e.message);
    //         return;
    //     }
    //     throw e;
    // }
}

function codeGen(expression) {
    const {type} = expression;
    switch (type) {
    case 'Expression':
        return codeGen(expression.value);

    case 'Identifier':
        return expression.name;

    case 'BinaryExpression':
    case 'LogicalExpression': {
        const left = codeGen(expression.left);
        const right = codeGen(expression.right);
        return `${left}${expression.operator}${right}`;
    }

    case 'MemberExpression': {
        const object = codeGen(expression.object);
        let property = codeGen(expression.property);
        property = (expression.computed) ? property: ('"'+property+'"');
        return `${object}[${property}]`;
    }

    case 'Compound': {
        // eslint-disable-next-line
        debugger
        break;
    }

    case 'Literal':
        return expression.raw;

    case 'CallExpression': {
        const callee = codeGen(expression.callee);
        const args = expression.arguments.map(codeGen);
        return `${callee}(${args.join(',')})`;
    }

    case 'ThisExpression':
        return 'this';

    case 'UnaryExpression': {
        const operator = expression.operator;
        const argument = codeGen(expression.argument);
        return `${operator}(${argument})`;
    }

    case 'ConditionalExpression': {
        const test = codeGen(expression.test);
        const consequent = codeGen(expression.consequent);
        const alternate = codeGen(expression.alternate);
        return `${test}?${consequent}:${alternate}`;
    }

    case 'ArrayExpression':
        return '[' + expression.elements.map(codeGen).join(',') + ']';

    default:
        warn('unexpected expression:');
        warn(JSON.stringify(expression));
    }
}

export {
    EvalExpression, codeGen
};
