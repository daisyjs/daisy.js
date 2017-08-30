const {TAGNAME, END_TAG} = require('./StateTypes');
//  
function isSpace(letter = '') {
    const code = letter.charCodeAt(0);
    return code == 32;
}

// a-z
function isLowerCase(letter = '') {
    const code = letter.charCodeAt(0);
    return code >= 97 && code <= 122;
}

// A-Z
function isUpperCase(letter = '') {
    const code = letter.charCodeAt(0);
    return code >= 65 && code <= 90;
}

function isWord(letter = '') {
    return isLowerCase(letter) || isUpperCase(letter);
}

// 0-9
function isNumber(letter = '') {
    const code = letter.charCodeAt(0);
    return code >= 48 && code <= 57;
}

// _
function isUnderscore(letter = '') {
    const code = letter.charCodeAt(0);
    return code === 95;
}

// $
function isDollar(letter = '') {
    const code = letter.charCodeAt(0);
    return code === 36;
}

// !
function isExclamationMark (letter = '') {
    const code = letter.charCodeAt(0);
    return code === 33;
}

// !
function isDash (letter = '') {
    const code = letter.charCodeAt(0);
    return code === 45;
}

// <
function isOpenTag(letter = '') {
    const code = letter.charCodeAt(0);
    return code === 60;
}

// >
function isCloseTag(letter = '') {
    const code = letter.charCodeAt(0);
    return code === 62;
}


// /
function isSlash(letter = '') {
    const code = letter.charCodeAt(0);
    return code === 47;
}

// =
function isEqual(letter = '') {
    const code = letter.charCodeAt(0);
    return code === 61;
}

// '||"
function isQuote(letter = '') {
    const code = letter.charCodeAt(0);
    return [34, 39].includes(code);
}

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
function isVoidTag(tag) {
    return voidTagTypes.includes(tag);
}

function isSelfClose({type, isSelfClose}) {
    return type === TAGNAME && isSelfClose;
}

function returnUnclosedTagError({
    content, line, column
}) {
    return `Unclosed TAG ${content} : \nline - ${line}, column - ${column}`;
}

function returnUnLegalEndError(state, {
    content, line, column
}) {
    return `UnLegal end ${state} ${content} : \nline - ${line}, column - ${column}`;
}

exports.isSpace = isSpace;
exports.isCloseTag = isCloseTag;
exports.isDash = isDash;
exports.isDollar = isDollar;
exports.isEqual = isEqual;
exports.isExclamationMark = isExclamationMark;
exports.isLowerCase = isLowerCase;
exports.isNumber = isNumber;
exports.isOpenTag = isOpenTag;
exports.isQuote = isQuote;
exports.isSlash = isSlash;
exports.isUnderscore = isUnderscore;
exports.isUpperCase = isUpperCase;
exports.isWord = isWord;

exports.isTagClosed = isTagClosed;
exports.isVoidTag = isVoidTag;
exports.isSelfClose = isSelfClose;
exports.returnUnLegalEndError = returnUnLegalEndError;