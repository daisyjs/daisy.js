import {
    Types
} from './NodeTypes';
import {EvalExpression, codeGen} from './EvalExpression';
import Element from './Element';
import {warn} from './helper';

const {
    Program, If, For, Element: ElementType, Expression, Text, Attribute
} = Types;

function diffVTree(lastVTree, nextVTree) {
    return []; // difference set
}

function patch(realTree, differences) {
    // walk the difference set and update
}

function createVElement(node, viewContext) {
    const {state, methods} = viewContext;
    switch (node.type) {
    case Text:
        return node.value;

    case Attribute: {
        const {value} = node;
        if (value.type === Expression) {
            return Object.assign({}, node, {
                value: createVElement(value, viewContext)
            });
        }
        return node;
    }

    case ElementType: {
        const {
            attributes, directives, children, name
        } = node;

        if (name.toLowerCase() === 'block') {
            return createVGroup(children, viewContext);
        }

        return Element.create(
            node.name,
            attributes.map((attribute) => createVElement(attribute, viewContext)),
            createVGroup(children, viewContext)
        );
    }

    case If: {
        let result;
        if (EvalExpression(node.test, viewContext)) {
            result = createVElement(node.consequent, viewContext);
        } else if (node.alternate) {
            result = createVElement(node.alternate, viewContext);
        }
        return result;
    }

    case For: {
        const list = EvalExpression(node.test, viewContext);
        const {item, index} = node.init;
        const itemName = codeGen(item);
        const indexName = codeGen(index);

        const body = list.map((item, index) => createVElement(node.body, {
            state: Object.assign({}, state, {
                [itemName]: item,
                [indexName]: index
            }),
            methods
        }));

        return body;
    }

    case Expression: {
        const result = EvalExpression(node, viewContext);
        if (typeof result !== 'string') {
            return JSON.stringify(result, null, 4);
        }
        return result;
    }
    default:
    }
}

function createVGroup(nodes, viewContext) {
    let group = [];
    nodes.forEach((node) => {
        const result = createVElement(node, viewContext);
        if (result === void 0) {
            return;
        }

        if (Array.isArray(result)) {
            group = [
                ...group, ...result
            ];
        } else {
            group.push(result);
        }
    });
    return group;
}

function createVTree(ast, viewContext) {
    // create virtual dom
    const {type, body} = ast;
    if (type === Program) {
        return createVGroup(body, viewContext);
    } else {
        warn('Root node must be Program!');
    }
}

export {
    createVTree,
    diffVTree,
    patch
};
