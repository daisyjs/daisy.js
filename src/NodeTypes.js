function Program(body) {
    return {
        type: 'Program',
        body
    };
}

function If(test, consequent, alternate) {
    return {
        type: 'If',
        test,
        alternate,
        consequent,
    };
}

function For(test, init, body) {
    return {
        type: 'For',
        test,
        init,
        body,
    };
}

function Element(name, attrubites = [], directives = [], children = []) {
    return {
        type: 'Element',
        name,
        attrubites,
        directives,
        children
    };
}

function Attribute(name, value) {
    return {
        type: 'Attribute',
        name,
        value
    };
}

function Expression(value) {
    return {
        type: 'Expression',
        value
    };
}

function Text (text) {
    return {
        type: 'TEXT',
        value: text
    };
}

function Comment(comment) {
    return {
        type: 'Comment',
        value: comment
    };
}

const Types = {
    Program: 'Program',
    If: 'If',
    For: 'For',
    Element: 'Element',
    Attribute: 'Attribute',
    Expression: 'Expression',
    Text: 'Text',
    Comment: 'Comment'
};

export {
    Program, If, For, Element, Attribute, Expression, Text, Comment,
    Types
};
