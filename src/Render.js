import {
    Types
} from './NodeTypes';

const {
    Program, If, For, Element, Attribute, Expression, Text, Comment
} = Types;

function createViewTree(nodes) {
    return document.createElement('div');
}

function diffVirtualDOM(prevVirtualDom, nextVirtualDom) {
    return []; // difference set
}

function patch(differenceSet) {
    // walk the difference set and update
}

class ElementNode {
    constructor(tagName, props, children, key) {
        this.tagName = tagName
        this.props = props || {}
        this.children = children || []
        this.key = key;
    }
}

function renderItem(node, state) {
    switch (node.type) {
        case Text:
            return node.value;
        case Element:
            const {
                attribute, directives, children
            } = node;
            return new ElementNode(node.name, attribute, render(children, state));
        case If:
            let result;
            if (evalExpression(node.test, state)) {
                result = renderItem(node.consequent, state);
            } else if (node.alternate) {
                result = renderItem(node.alternate, state);
            }
            return result;
        case Expression:
            return evalExpression(node, state);
        default:
    }
}

function render(nodes, state) {
    const group = [];
    nodes.forEach((node) => {
        group.push(renderItem(node, state))
    });
    return group;
}

function createVirtualDOM(abstractSyntaxNode, state) {
    // create virtual dom
    const programBody = abstractSyntaxNode.body;
    let child, i = 0;

    const virtualDOM = render(programBody, state);
    console.log('virtualDOM created:');
    console.log(virtualDOM);
    return virtualDOM;
}

function evalExpression(expression, state) {
    const {type} = expression;

    switch (type) {
        case 'Expression':
            return evalExpression(expression.value, state);
        case 'Identifier':
            return state[expression.name];
        case 'BinaryExpression':
            const leftResult = evalExpression(expression.left, state);
            const rightResult = evalExpression(expression.right, state);
            return new Function('leftResult', 'rightResult', `return leftResult ${expression.operator} rightResult`)(leftResult, rightResult);
        default:
            console.log('unexpected expression:');
            console.log(JSON.stringify(expression));
    }
}

export {
    Render,
    createVirtualDOM,
    createViewTree,
    diffVirtualDOM,
    patch
};
