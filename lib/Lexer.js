const {INIT, OPEN_TAG, CLOSE_TAG, END_TAG, TAGNAME, TAG, EXPR, TEXT, ATTR, EQUAL, VALUE, EOF} = require('./StateTypes');

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
function isOpenExpr(letter) {
    const code = letter.charCodeAt(0);
    return code === 123;
}

// }
function isCloseExpr(letter) {
    const code = letter.charCodeAt(0);
    return code === 125;
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

function Lexer(source) {
    let state = INIT;
    let pos = 0;
    let tokens = [];
    let temp = [];
    let letter;

    while (letter = source[pos]) {
        if (state === INIT) {
            if (isOpenTag(letter)) {
                if (isSlash(getNextLetter())) {
                    if (isSpace(getNextLetter(2))) {
                        pushToTemp(letter);
                        next();
                        changeState(TEXT);
                    } else {
                        changeState(END_TAG);
                        next(2);
                    }
                } else {
                    if (isSpace(getNextLetter())) {
                        pushToTemp(letter);
                        next();
                        changeState(TEXT);
                    } else {
                        changeState(OPEN_TAG);
                        next();
                    }
                }
            } else if (isOpenExpr(letter)) {
                changeState(EXPR);
                next();
            } else {
                changeState(TEXT);
            }
            resetTemp();
        } else if (state === OPEN_TAG) {
            if (isSpace(letter)) {
                next();
            } else {
                changeState(TAGNAME);
                resetTemp();
            }
        } else if (state === TAGNAME) {
            if (isSpace(letter)) {
                pushToken(TAGNAME);
                changeState(TAG);
                next();
                resetTemp();
            } else if ((isSlash(letter) && isCloseTag(getNextLetter()))) {
                pushToken(TAGNAME);
                changeState(CLOSE_TAG);
                next();
            } else if (isCloseTag(letter)) {
                pushToken(TAGNAME);
                changeState(CLOSE_TAG);
            } else {
                next();
                pushToTemp(letter);
            }
        } else if (state === TAG) {
            if (isCloseTag(letter)) {
                changeState(CLOSE_TAG);
            } else if (isSpace(letter)) {
                next();
            } else {
                changeState(ATTR);
                resetTemp();
            }
        } else if (state === ATTR) {
            if (isEqual(letter)) {
                pushToken(ATTR);
                next();
                changeState(EQUAL);
                resetTemp();
            } else if (isSpace(letter)) {
                next();
                pushToken(ATTR);
                resetTemp();
            } else if (isCloseTag(letter)) {
                pushToken(ATTR);
                changeState(CLOSE_TAG);
            } else {
                next();
                pushToTemp(letter);
            }
        } else if (state === EQUAL) {
            if (isQuote(letter)) {
                pushToTemp(letter);
                next();
                changeState(VALUE);
            } else if (isSpace(letter)) {
                next();
            } else if (isCloseTag(letter)) {
                changeState(CLOSE_TAG);
            } else {
                changeState(VALUE);
            }
        } else if (state === CLOSE_TAG) {
            changeState(INIT);
            next();
            resetTemp();
        } else if (state === VALUE) {
            if (
                isQuote(letter) && letter === temp[0] && getPrevLetter() !== '//'
            ) {
                pushToTemp(letter);
                pushToken(VALUE);
                next();
                changeState(TAG);
            }  else if (isSpace(letter)) {
                if (isQuote(temp[0])) {
                    next();
                    pushToTemp(letter);
                } else {
                    pushToken(VALUE);
                    next();
                    changeState(TAG);
                }
            } else if (isCloseTag(letter)) {
                pushToken(VALUE);
                changeState(CLOSE_TAG);
            } else {
                next();
                pushToTemp(letter);
            }
        } else if (state === END_TAG) {
            if (isSpace(letter)) {
                next();
            } else if (isCloseTag(letter)) {
                pushToken(END_TAG);
                changeState(CLOSE_TAG);
            } else {
                pushToTemp(letter);
                next();
            }
        } else if (state === EXPR) {
            if (isOpenExpr(letter)) {
                pushToTemp(letter);
                pushToken(TEXT);
                resetTemp();
                next();
            } else if (isCloseExpr(letter)) {
                pushToken(EXPR);
                next();
                changeState(INIT);
            } else {
                pushToTemp(letter);
                next();
            }
        } else if (state === TEXT) {
            if (isOpenTag(letter) || isOpenExpr(letter)) {
                pushToken(TEXT);
                changeState(INIT);
            } else {
                pushToTemp(letter);
                next();
            }
        }
    }

    tokens = mergeTextTokens(tokens);

    tokens = [...tokens, {
        type: EOF
    }];

    return tokens;

    function next(i = 1) {
        pos += i;
    }

    function changeState(nextState) {
        state = nextState;
    }

    function pushToken(type) {
        const sourceFragment = source.substr(0, pos);
        const matchLines = sourceFragment.match(/\n/g);
        const matchColumns = sourceFragment.match(/[^\n]*$/g);
        const line = (matchLines && matchLines.length) + 1;
        const column = (matchColumns && matchColumns.length);

        tokens.push({
            type, content: getContentFromTemp(),
            pos: pos,
            line,
            column
        });
    }

    function pushToTemp(item) {
        temp.push(item);
    }

    function resetTemp() {
        temp.length = 0;
    }

    function getContentFromTemp() {
        return temp.join('');
    }

    function getPrevLetter(i = 1) {
        return source[pos - i];
    }

    function getNextLetter(i = 1) {
        return source[pos + i];
    }
}

function mergeTextTokens(tokens) {
    let index = 0;
    return tokens.reduce((list, token) => {
        const prevToken = list[index - 1];

        if ((token.type === TEXT) && prevToken && (prevToken.type === TEXT)) {
            prevToken.content += token.content;
        } else {
            list.push(token);
            index++;
        }
        return list;
    }, []);
}


exports.Lexer = Lexer;