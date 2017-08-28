function Program(body) {
    return {
        type: 'Program',
        body
    };
}

function If(test, alternate, consequent) {
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

function Element(name, attrubites = [], children = []) {
    return {
        type: 'Element',
        name,
        attrubites,
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

module.exports = {
    Program, If, For, Element, Attribute, Expression, Text, Comment,
    Types: {
        Program: 'Program', 
        If: 'If', 
        For: 'For', 
        Element: 'Element', 
        Attribute: 'Attribute', 
        Expression: 'Expression',
        Text: 'Text',
        Comment: 'Comment'
    }
};