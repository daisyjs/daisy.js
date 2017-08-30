const {INIT, OPEN_TAG, OPEN_COMMENT, COMMENT, CLOSE_TAG, END_TAG, TAGNAME, TAG, EXPR, TEXT, ATTR, EQUAL, VALUE, EOF} = require('./StateTypes');
const {isSlash, isSpace, isOpenTag, isExclamationMark, isDash, isCloseTag, isEqual, isQuote, isTagClosed, returnUnLegalEndError} = require('./helper');
const {isOpenExpr, isCloseExpr, getExpressionBounds} = require('./Expression');

function Lexer(source) {
    let states = [];
    let pos = 0;
    let tokens = [];
    let temp = [];
    let letter;
    const {open: EXPR_OPEN_BOUNDS, close: EXPR_CLOSE_BOUNDS} = getExpressionBounds();

    pushState(INIT);

    /* eslint-disable */
    while (letter = source[pos]) {
    /* eslint-enable */
        const state = getState();
        if (state === INIT) {
            resetTemp();
            if (isOpenTag(letter)) {
                if (isSlash(getNextLetter())) {
                    if (
                        isSpace(getNextLetter(2)) ||
                        isOpenTag(getNextLetter(2))
                    ) {
                        // (</ ) || (</<)
                        pushToTemp(letter);
                        pushState(TEXT);
                        next();
                    } else {
                        // </a>
                        pushState(END_TAG);
                        next(2);
                    }
                } else if (isExclamationMark(getNextLetter())
                    && isDash(getNextLetter(2))
                    && isDash(getNextLetter(3))
                ) {
                    // <!--
                    pushState(OPEN_COMMENT);
                    next(4);
                } else {
                    // (< )
                    if (isSpace(getNextLetter())) {
                        pushToTemp(letter);
                        pushState(TEXT);
                        next();
                    } else {
                        // <a
                        pushState(OPEN_TAG);
                        next();
                    }
                }
            } else if (
                isOpenExpr(letter, getNextLetter())
            ) {
                next(2);
                pushState(EXPR);
            } else {
                pushState(TEXT);
            }
        } else if (state === OPEN_TAG) {
            if (isSpace(letter)) {
                next();
            } else {
                pushState(TAGNAME);
                resetTemp();
            }
        } else if (state === TAGNAME) {
            if (isSpace(letter)) {
                pushToken(TAGNAME);
                pushState(TAG);
                resetTemp();
            } else if (isSlash(letter) && isCloseTag(getNextLetter())) {
                pushToken(TAGNAME);
                pushState(TAG);
            } else if (isCloseTag(letter)) {
                pushToken(TAGNAME);
                pushState(TAG);
            } else {
                next();
                pushToTemp(letter);
            }
        } else if (state === TAG) {
            if (isCloseTag(letter)) {
                pushState(CLOSE_TAG);
            } else if (isSlash(letter) && isCloseTag(getNextLetter())) {
                setTokenSelfClose(findLastTypeToken(TAGNAME));
                pushState(CLOSE_TAG);
                next();                
            } else if (isSpace(letter)) {
                next();
            } else {
                pushState(ATTR);
                resetTemp();
            }
        } else if (state === ATTR) {
            if (isEqual(letter)) {
                pushToken(ATTR);
                pushState(EQUAL);
                next();
                resetTemp();
            } else if (isSlash(letter) && isCloseTag(getNextLetter())) {
                pushToken(ATTR);
                pushState(TAG);
            } else if (isSpace(letter)) {
                next();
                pushToken(ATTR);
                resetTemp();
            } else if (isSlash(letter) && isCloseTag(getNextLetter())) {
                pushState(TAG);
            } else if (isCloseTag(letter)) {
                pushToken(ATTR);
                pushState(TAG);
            } else {
                next();
                pushToTemp(letter);
            }
        } else if (state === EQUAL) {
            if (isQuote(letter)) {
                pushToTemp(letter);
                pushState(VALUE);
                next();
            }  else if (isOpenExpr(letter, getNextLetter())) {
                pushState(TAG);
                next(2);
                pushState(EXPR);
            } else if (isSpace(letter)) {
                next();
            } else if (isCloseTag(letter)) {
                pushState(TAG);
            } else {
                pushState(VALUE);
            }
        } else if (state === VALUE) {
            if (
                isQuote(letter) && letter === temp[0] && getPrevLetter() !== '\\'
            ) {
                pushToTemp(letter);
                pushState(TAG);
                next();
                pushToken(VALUE);
            } else if (isSpace(letter)) {
                if (isQuote(temp[0])) {
                    pushToTemp(letter);
                    next();
                } else {
                    pushToken(VALUE);
                    pushState(TAG);
                    next();
                }
            } else if (isCloseTag(letter)) {
                pushToken(VALUE);
                pushState(TAG);
            } else {
                pushToTemp(letter);
                next();
                
            }
        } else if (state === CLOSE_TAG) {
            popState(CLOSE_TAG);

            if (isAttrState()) {
                while (isAttrState()) {
                    popState();
                }
            }

            popState(TAGNAME);
            popState(OPEN_TAG);
            
            next();
            resetTemp();
        } else if (state === END_TAG) {
            if (isSpace(letter)) {
                next();
            } else if (isCloseTag(letter)) {
                pushToken(END_TAG);
                popState(END_TAG);
                next();
            } else {
                pushToTemp(letter);
                next();
            }
        } else if (state === EXPR) {
            if (
                isOpenExpr(letter, getNextLetter())
            ) {
                pushToTemp(EXPR_OPEN_BOUNDS);
                pushToken(TEXT);
                resetTemp();
                next(EXPR_OPEN_BOUNDS.length);
            } else if (
                isCloseExpr(letter, getNextLetter())
            ) {
                pushToken(EXPR);
                next(EXPR_CLOSE_BOUNDS.length);
                popState(EXPR);
                resetTemp();
            } else {
                pushToTemp(letter);
                next();
            }
        } else if (state === TEXT) {
            if (isOpenTag(letter) || (isOpenExpr(letter, getNextLetter()))) {
                pushToken(TEXT);
                popState();
            } else {
                pushToTemp(letter);
                next();
            }
        } else if (state === OPEN_COMMENT) {
            if (isDash(letter) && isDash(getNextLetter()) && isCloseTag(getNextLetter(2))) {
                pushToken(COMMENT);
                next(3);
                popState();
            } else {
                next();
                pushToTemp(letter);
            }
        }
    }

    let refs = transformUnEndStates();
    if (refs.message) {
        throw refs.message;
    }

    tokens = refs.tokens;

    tokens = mergeTextTokens();

    tokens = [...tokens, {
        type: EOF
    }];

    refs = isTagClosed(tokens);
    if (refs.message) {
        throw refs.message;
    }

    return tokens;

    function next(i = 1) {
        pos += i;
    }

    function pushState(nextState) {
        states.push({
            state: nextState,
            pos
        });
    }

    function pushToken(refs) {
        const {line, column} = getPosition(pos);
        const content = getContentFromTemp();
        const token = refs.type ? refs : {
            type: refs,
            content,
            pos: pos - content.length,
            line,
            column
        };

        tokens.push(token);

        return token;
    }

    function getPosition(pos) {
        const sourceFragment = source.substr(0, pos);
        const matchLines = sourceFragment.match(/\n/g);
        const matchColumns = sourceFragment.match(/[^\n]*$/g);
        const line = (matchLines && matchLines.length) + 1;
        const column = (matchColumns && matchColumns[0].length);
        return {
            line, column
        };
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

    function setTokenSelfClose(token) {
        token.isSelfClose = true;
    }

    function getState() {
        return (states[states.length - 1] || {}).state;
    }

    function popState(expectState) {
        if (!expectState) {
            return states.pop();
        }

        if (getState() === expectState) {
            return states.pop();
        }
        throw `Check your syntax - expect state ${expectState}, but actual state is ${getState()}`;
    }

    function isAttrState() {
        return [TAG, ATTR, EQUAL, VALUE].includes(getState());
    }

    function findLastTypeToken(type) {
        let i = tokens.length;
        while ( i -- ) {
            if (tokens[i].type === type) {
                return tokens[i];
            }
        }
        throw `Cannt find tokenType - ${type}`;
    }

    function transformUnEndStates() {
        let tokenTemp = [];
        
        if  (states.length !== 1) {
            let rollbackPos = source.length;
            
            /* eslint-disable */
            while (states.length > 1) {
            /* eslint-enable */
                const {pos, state} = states[states.length - 1];
                const {line, column} = getPosition(pos);
                let content = source.substring(pos, rollbackPos);
        
                switch (state) {
                case OPEN_COMMENT:
                    content = content.substring(content.indexOf('<!--') + 4);
                    tokenTemp.push({ type: COMMENT, pos, content, line, column, });
                    break;
                case TEXT:
                case OPEN_TAG:
                    tokenTemp.push({ type: TEXT, pos, content, line, column, });
                    break;
                case TAGNAME:
                case ATTR:
                case EQUAL:
                case VALUE:
                    return {
                        message: returnUnLegalEndError(state, {content, line, column})
                    };
                case EXPR:
                    return {
                        message: returnUnLegalEndError('expression', {content, line, column})
                    };
                default: 
                    break;
                }
                popState();
                rollbackPos = pos;
            }
        }

        if (tokenTemp.length > 0) {
            tokens = [
                ...tokens,
                ...tokenTemp.reverse()
            ];
        }

        return {
            tokens
        };
    }

    function mergeTextTokens() {
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
    
}

exports.Lexer = Lexer;
