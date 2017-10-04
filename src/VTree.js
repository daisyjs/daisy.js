import {
    Types
} from './NodeTypes';
import {EvalExpression, codeGen} from './EvalExpression';
import {Element, Elements} from './Element';
import {warn} from './helper';


const {
    Program, If, For, Element: ElementType, Expression, Text, Attribute
} = Types;

const BLOCK = 'block';

function diffVTree(lastVTree, nextVTree) {
    return []; // difference set
}

function patch(rTree, differences) {
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
            const valueEvaluted = EvalExpression(value, viewContext);
            if (valueEvaluted === false) {
                return null;
            }
            return Object.assign({}, node, {
                value: valueEvaluted
            });
        }
        return node;
    }

    case ElementType: {
        const {
            attributes, directives, children, name
        } = node;

        if (name.toLowerCase() === BLOCK) {
            return createVGroup(children, viewContext);
        }

        return Element.create(
            node.name,
            attributes.map((attribute) => createVElement(attribute, viewContext)).filter(item => item),
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
        const elements = Elements.create();
        const list = EvalExpression(node.test, viewContext);
        const {item, index} = node.init;
        const itemName = codeGen(item);
        const indexName = codeGen(index);

        list.forEach(
            (item, index) => {
                elements.push(createVElement(node.body, {
                    state: Object.assign({}, state, {
                        [itemName]: item,
                        [indexName]: index
                    }),
                    methods
                }));
            }
        );

        return elements;
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
    const elements = Elements.create();

    nodes.forEach((node) => {
        elements.push(createVElement(node, viewContext));
    });

    return elements;
}

function createVTree(ast, viewContext) {
    // create virtual dom
    const {type, body} = ast;
    if (type === Program) {
        return createVGroup(body, viewContext);
    } else {
        warn('Root element must be Program!');
    }
}

export {
    createVTree,
    diffVTree,
    patch
};
