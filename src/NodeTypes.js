export const Types = {
    Program: 'Program',
    If: 'If',
    For: 'For',
    Element: 'Element',
    Attribute: 'Attribute',
    Expression: 'Expression',
    Text: 'Text',
    Comment: 'Comment'
};

export function Program(body) {
    return {
        type: Types.Program,
        body
    };
}

export function If(test, consequent, alternate) {
    return {
        type: Types.If,
        test,
        alternate,
        consequent,
    };
}

export function For(test, init, body) {
    return {
        type: Types.For,
        test,
        init,
        body,
    };
}

export function Element(name, attributes = [], directives = [], children = []) {
    return {
        type: Types.Element,
        name,
        attributes,
        directives,
        children
    };
}

export function Attribute(name, value) {
    return {
        type: Types.Attribute,
        name,
        value
    };
}

export function Expression(value) {
    return {
        type: Types.Expression,
        value
    };
}

export function Text (text) {
    return {
        type: Types.Text,
        value: text
    };
}

export function Comment(comment) {
    return {
        type: Types.Comment,
        value: comment
    };
}