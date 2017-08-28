//  
function isSpace(letter) {
    const code = letter.charCodeAt(0);
    return code == 32;
}

// a-z
function isLowerCase(letter) {
    const code = letter.charCodeAt(0);
    return code >= 97 && code <= 122;
}

// A-Z
function isUpperCase(letter) {
    const code = letter.charCodeAt(0);
    return code >= 65 && code <= 90;
}

function isWord(letter) {
    return isLowerCase(letter) || isUpperCase(letter);
}

// 0-9
function isNumber(letter) {
    const code = letter.charCodeAt(0);
    return code >= 48 && code <= 57;
}

// _
function isUnderscore(letter) {
    const code = letter.charCodeAt(0);
    return code === 95;
}

// $
function isDollar(letter) {
    const code = letter.charCodeAt(0);
    return code === 36;
}

// !
function isExclamationMark (letter) {
    const code = letter.charCodeAt(0);
    return code === 33;
}

// !
function isDash (letter) {
    const code = letter.charCodeAt(0);
    return code === 45;
}

// <
function isOpenTag(letter) {
    const code = letter.charCodeAt(0);
    return code === 60;
}

// >
function isCloseTag(letter) {
    const code = letter.charCodeAt(0);
    return code === 62;
}

// {
function isOpenExpr(letter = '', nextLetter = '') {
    const code = letter.charCodeAt(0);
    const nextCode = nextLetter.charCodeAt(0);
    
    return code === 123 && nextCode === 123;
}

// }
function isCloseExpr(letter = '', nextLetter = '') {
    const code = letter.charCodeAt(0);
    const nextCode = nextLetter.charCodeAt(0);
    
    return code === 125 && nextCode === 125;
}

// includes {{ }}
function isIncludeExpr (words) {
    return words.includes('{{') && words.includes('}}');
}

// /
function isSlash(letter) {
    const code = letter.charCodeAt(0);
    return code === 47;
}

// =
function isEqual(letter) {
    const code = letter.charCodeAt(0);
    return code === 61;
}

// '||"
function isQuote(letter) {
    const code = letter.charCodeAt(0);
    return code === 34 || code === 39;
}

exports.isSpace = isSpace;
exports.isCloseExpr = isCloseExpr;
exports.isCloseTag = isCloseTag;
exports.isDash = isDash;
exports.isDollar = isDollar;
exports.isEqual = isEqual;
exports.isExclamationMark = isExclamationMark;
exports.isIncludeExpr = isIncludeExpr;
exports.isLowerCase = isLowerCase;
exports.isNumber = isNumber;
exports.isOpenExpr = isOpenExpr;
exports.isOpenTag = isOpenTag;
exports.isQuote = isQuote;
exports.isSlash = isSlash;
exports.isUnderscore = isUnderscore;
exports.isUpperCase = isUpperCase;
exports.isWord = isWord;