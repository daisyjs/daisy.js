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