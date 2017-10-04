import {TAGNAME, END_TAG} from './StateTypes';

function isTagClosed(tokens) {
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

const voidTagTypes = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'r-content'];
const isVoidTag = (tag) => voidTagTypes.includes(tag);

const isSelfClose = ({type, isSelfClose}) => type === TAGNAME && isSelfClose;

const returnUnclosedTagError = ({
    content, line, column
}) =>
    `Unclosed TAG ${content} : \nline - ${line}, column - ${column}`;

// a-zA-Z
const isSpace = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code === 32 || code === 10;
};
// A-Z
const isLowerCase = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code >= 97 && code <= 122;
};
// A-Z
const isUpperCase = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code >= 65 && code <= 90;
};
// a-zA-Z
const isWord = (letter = '') => isLowerCase(letter) || isUpperCase(letter);
//  0-9
const isNumber = (letter = '') => {
    const code = letter.charCodeAt(0);
    return code >= 48 && code <= 57;
};
// _
const isUnderscore = (letter = '') => 95 === letter.charCodeAt(0);
// $
const isDollar = (letter = '') => 36 === letter.charCodeAt(0);
// !
const isExclamationMark = (letter = '') => 33 === letter.charCodeAt(0);
// <
const isOpenTag = (letter = '') => 60 === letter.charCodeAt(0);
// !
const isDash = (letter = '') => 45 === letter.charCodeAt(0);
// '||"
const isQuote = (letter = '') => [34, 39].includes(letter.charCodeAt(0));
// =
const isEqual = (letter = '') => 61 === letter.charCodeAt(0);
// /
const isSlash = (letter = '') => 47 === letter.charCodeAt(0);
// >
const isCloseTag = (letter = '') => 62 === letter.charCodeAt(0);

// eslint-disable-next-line
const warn = (message) => console.warn(message);
// eslint-disable-next-line
const error = (message) => console.error(message);

const isEmpty = o => Object.keys(o).length === 0;
const isObject = o => o != null && typeof o === 'object';
const properObject = o => isObject(o) && !o.hasOwnProperty ? Object.assign({}, o) : o;
const isDate = d => d instanceof Date;


const directiveGetter = (pattern, directives) => {
    const isRegExpLike = (item) => item.startsWith('/') && item.endsWith('/');
    const createRegExp = (item) => new RegExp(item.slice(1, item.length-1));

    for (let name in directives) {
        if (isRegExpLike(name)) {
            if (createRegExp(name).test(pattern)) {
                return directives[name];
            }
        } else if (name === pattern) {
            return directives[name];
        }
    }

    throw new Error(`cannt find the directive ${pattern}!`);
};
export{
    isSpace,
    isCloseTag,
    isDash,
    isDollar,
    isEqual,
    isExclamationMark,
    isLowerCase,
    isNumber,
    isOpenTag,
    isQuote,
    isSlash,
    isUnderscore,
    isUpperCase,
    isWord,
    isTagClosed,
    isVoidTag,
    isSelfClose,
    error,
    warn,
    isEmpty,
    isObject,
    isDate,
    properObject,
    directiveGetter
};
