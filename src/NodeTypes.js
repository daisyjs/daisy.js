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

function Program(body) {
    return {
        type: Types.Program,
        body
    };
}

function If(test, consequent, alternate) {
    return {
        type: Types.If,
        test,
        alternate,
        consequent,
    };
}

function For(test, init, body) {
    return {
        type: Types.For,
        test,
        init,
        body,
    };
}

function Element(name, attributes = [], directives = [], children = []) {
    return {
        type: Types.Element,
        name,
        attributes,
        directives,
        children
    };
}

function Attribute(name, value) {
    return {
        type: Types.Attribute,
        name,
        value
    };
}

function Expression(value) {
    return {
        type: Types.Expression,
        value
    };
}

function Text (text) {
    return {
        type: Types.Text,
        value: text
    };
}

function Comment(comment) {
    return {
        type: Types.Comment,
        value: comment
    };
}



export {
    Program, If, For, Element, Attribute, Expression, Text, Comment,
    Types
};
