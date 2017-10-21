import { warn, debug } from '../../shared/helper';

const expressionMap = new Map();
const compute = computed => {
    const computedResult = Object.keys(computed).reduce((result, item) => {
        return Object.assign(result, {
            [item]:
                typeof computed[item] === 'function'
                    ? computed[item]()
                    : computed[item]
        });
    }, {});
    return computedResult;
};

export function evalExpression(
    expression,
    { state, methods, context, computed = {} }
) {
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
    const scope = Object.assign({}, methods, state, compute(computed));
    debug(codeFn);
    return codeFn.call(context, scope);
}

export function codeGen(expression) {
    const { type } = expression;
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
        property = expression.computed ? property : '"' + property + '"';
        return `${object}[${property}]`;
    }

    case 'Compound': {
        // eslint-disable-next-line
            // debugger
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
        return `(${test}?${consequent}:${alternate})`;
    }

    case 'ArrayExpression':
        return '[' + expression.elements.map(codeGen).join(',') + ']';

    default:
        warn('unexpected expression:');
        warn(JSON.stringify(expression));
    }
}
