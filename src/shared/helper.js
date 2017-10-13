import {TAGNAME, END_TAG} from './StateTypes';

export function isTagClosed(tokens) {
    let stack = [];
    let i = 0;
    while( i < tokens.length) {
        const token = tokens[i];
        const {type, content} = token;
        const nextToken = tokens[i + 1];
        if (type === TAGNAME) {
            if (!isSelfClose(token)) {
                if (!isVoidTag(content) ||
                    (nextToken.type === END_TAG
                        && nextToken.content === content
                    )
                ) {
                    stack.push(token);
                }
            }
        } else if (type === END_TAG) {
            const stackTop = stack[stack.length - 1];
            if (stackTop.content === content) {
                stack.pop();
            } else {
                return {
                    closed: false,
                    message: returnUnclosedTagError(stackTop)
                };
            }
        }
        i ++;
    }

    if (stack.length !== 0) {
        const stackTop = stack[stack.length - 1];
        return {
            closed: false,
            message: returnUnclosedTagError(stackTop)
        };
    }

    return {closed: true};
}

export const voidTagTypes = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'r-content'];
export const isVoidTag = (tag) => voidTagTypes.includes(tag);

export const isSelfClose = ({type, isSelfClose}) => type === TAGNAME && isSelfClose;

export const returnUnclosedTagError = ({
    content, line, column
}) =>
    `Unclosed TAG ${content} : \nline - ${line}, column - ${column}`;

// a-zA-Z
export const isSpace = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code === 32 || code === 10;
};
// A-Z
export const isLowerCase = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code >= 97 && code <= 122;
};
// A-Z
export const isUpperCase = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code >= 65 && code <= 90;
};
// a-zA-Z
export const isWord = (letter = '') => isLowerCase(letter) || isUpperCase(letter);
//  0-9
export const isNumber = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code >= 48 && code <= 57;
};
// _
export const isUnderscore = (letter = '') => 95 === letter.charCodeAt(0);
// $
export const isDollar = (letter = '') => 36 === letter.charCodeAt(0);
// !
export const isExclamationMark = (letter = '') => 33 === letter.charCodeAt(0);
// <
export const isOpenTag = (letter = '') => 60 === letter.charCodeAt(0);
// !
export const isDash = (letter = '') => 45 === letter.charCodeAt(0);
// '||"
export const isQuote = (letter = '') => [34, 39].includes(letter.charCodeAt(0));
// =
export const isEqual = (letter = '') => 61 === letter.charCodeAt(0);
// /
export const isSlash = (letter = '') => 47 === letter.charCodeAt(0);
// >
export const isCloseTag = (letter = '') => 62 === letter.charCodeAt(0);

// eslint-disable-next-line
export const debug = (message) => {} //console.log('debug:', message);

// eslint-disable-next-line
export const warn = (message) => console.warn(message);
// eslint-disable-next-line
export const error = (message) => console.error(message);

export const isEmpty = o => Object.keys(o).length === 0;
export const isObject = o => o != null && typeof o === 'object';
export const properObject = o => isObject(o) && !o.hasOwnProperty ? Object.assign({}, o) : o;
export const isDate = d => d instanceof Date;


export const getDirective = (pattern, directives) => {
    const filtered = directives.filter(({test}) => {
        return test(pattern);
    });

    if (filtered.length === 0) {
        throw new Error(`cannt find the directive ${pattern}!`);
    } else {
        return filtered[0].handler;
    }
};

export const createDirective = ({name, value: handler}) => {
    const isRegExpLike = (item) => item.startsWith('/') && item.endsWith('/');
    const createRegExp = (item) => new RegExp(item.slice(1, item.length-1));
    return {
        test: isRegExpLike(name) ? 
            (pattern) => createRegExp(name).test(pattern)
            : (pattern) => {
                return name === pattern;
            },
        handler
    };
};

export const createEvent = ({name, value: handler}) => ({
    name: name,
    handler
});

export const getProppertyObject = (list) => {
    return list.reduce((prev, {name, value}) => {
        return Object.assign(prev, {
            [name]: value
        });
    }, {});
};

export const getRootElement = (element) => {
    while (element.context) {
        element = element.context;
    }
    return element;
};


export function isPrimitive(value) {
    return value === null || (typeof value !== 'function' && typeof value !== 'object');
}


const isNull =  (target) => target[name] === void 0 || target[name] === null;

export const assignPrimitive = (target, changed) => {
    for (let name in changed) {
        if (changed.hasOwnProperty(name)) {
            const changedValue = changed[name];

            if (isPrimitive(changedValue) || isNull(target[name])) {
                target[name] = changedValue;
            } else {
                assignPrimitive(target[name], changedValue);
            }
        }
    }
};


export const uid = () => {
    let id =  -1;
    return () => {
        return ++id;
    };
};

export const mixin = (klass, impl) => {
    return Object.assign(klass.prototype, impl);
};

export const noop = () => {};

export const clone = (json) => JSON.parse(JSON.stringify(json));