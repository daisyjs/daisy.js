import {
    Types
} from './NodeTypes';
import {EvalExpression, codeGen} from './EvalExpression';
const {
    Program, If, For, Element, Expression, Text
} = Types;

function createRealTree(nodes) {
    const fragment = document.createDocumentFragment();

    const viewItems = nodes.forEach(
        node =>
            fragment.appendChild(createNode(node))
    );

    return fragment;
}

function createNode(element) {
    if (typeof element !== 'object') {
        return document.createTextNode(element);
    }

    const {props, tagName, children} = element;
    const node = document.createElement(tagName);

    node.appendChild(
        createRealTree(children)
    );

    props.forEach(({name, value}) => {
        node.setAttribute(name, value);
    });

    return node;
}

function diffVTree(lastVTree, nextVTree) {
    return []; // difference set
}

function patch(realTree, differences) {
    // walk the difference set and update
}

class ElementNode {
    constructor(tagName, props, children, key) {
        this.tagName = tagName;
        this.props = props || [];
        this.children = children || [];
        this.key = key;
    }
}

function renderItem(node, viewContext) {
    const {state, methods} = viewContext;
    switch (node.type) {
    case Text:
        return node.value;
    case Element: {
        const {
            attributes, directives, children, name
        } = node;

        if (name.toLowerCase() === 'block') {
            return render(children, viewContext);
        }

        return new ElementNode(node.name, attributes, render(children, viewContext));
    }
    case If: {
        let result;
        if (EvalExpression(node.test, viewContext)) {
            result = renderItem(node.consequent, viewContext);
        } else if (node.alternate) {
            result = renderItem(node.alternate, viewContext);
        }
        return result;
    }
    case For:{
        const list = EvalExpression(node.test, viewContext);
        const {item, index} = node.init;
        const itemName = codeGen(item);
        const indexName = codeGen(index);

        const body = list.map((item, index) => renderItem(node.body, {
            state: Object.assign({}, state, {
                [itemName]: item,
                [indexName]: index
            }),
            methods
        }));
        return body;
    }
    case Expression:{
        return EvalExpression(node, viewContext);
    }
    default:
    }
}

function render(nodes, viewContext) {
    let group = [];
    nodes.forEach((node) => {
        const result = renderItem(node, viewContext);
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
        return render(body, viewContext);
    } else {
        console.log('Root node must be Program!');
    }
}

export {
    createVTree,
    createRealTree,
    diffVTree,
    patch
};
