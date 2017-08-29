let EXPR_OPEN_BOUNDS = '{{';
let EXPR_CLOSE_BOUNDS = '}}';

function Expression (source = '') {
    // source = source
    //     .replace(/^{/g, '')
    //     .replace(/}$/g, '');

    return source;
}

// {
function isOpenExpr(letter = '', nextLetter = '') {
    return [letter, nextLetter].indexOf(EXPR_OPEN_BOUNDS) === 0;
}

// }
function isCloseExpr(letter = '', nextLetter = '') {
    return [letter, nextLetter].indexOf(EXPR_CLOSE_BOUNDS) === 0;
}

// includes {{ }}
function isIncludeExpr(words = '') {
    return words.includes(EXPR_OPEN_BOUNDS) && words.includes(EXPR_CLOSE_BOUNDS);
}

function getExpressionBounds() {
    return {open: EXPR_OPEN_BOUNDS, close: EXPR_CLOSE_BOUNDS};
}

function setExpressionBounds({open, close}) {
    EXPR_OPEN_BOUNDS = open;
    EXPR_CLOSE_BOUNDS = close;
}

exports.isCloseExpr = isCloseExpr;
exports.isOpenExpr = isOpenExpr;
exports.isIncludeExpr = isIncludeExpr;
exports.Expression = Expression;
exports.getExpressionBounds = getExpressionBounds;
exports.setExpressionBounds = setExpressionBounds;