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
    return letter === EXPR_OPEN_BOUNDS.charAt(0) && nextLetter === EXPR_OPEN_BOUNDS.charAt(1);
}

// }
function isCloseExpr(letter = '', nextLetter = '') {
    return letter === EXPR_CLOSE_BOUNDS.charAt(0) && nextLetter === EXPR_CLOSE_BOUNDS.charAt(1);
}

// includes {{ }}
function isIncludeExpr(words = '') {
    return words.includes(EXPR_OPEN_BOUNDS) && words.includes(EXPR_CLOSE_BOUNDS);
}

exports.isCloseExpr = isCloseExpr;
exports.isOpenExpr = isOpenExpr;
exports.isIncludeExpr = isIncludeExpr;

exports.Expression = Expression;

exports.getExpressionBounds = () => ({open: EXPR_OPEN_BOUNDS, close: EXPR_CLOSE_BOUNDS});
exports.setExpressionBounds = ({open, close}) => {
    EXPR_OPEN_BOUNDS = open;
    EXPR_CLOSE_BOUNDS = close;
};