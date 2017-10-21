import parse from '../../../lib/jsep';

let STARTING_BOUND = '{{';
let ENDING_BOUND = '}}';

function pickExpr(words, startsPos) {
    const exprEndsIndex = words.indexOf(ENDING_BOUND, startsPos);
    const content =
        '(' +
        words.substring(
            startsPos + STARTING_BOUND.length,
            exprEndsIndex
        ) +
        ')';

    return {
        content,
        pos: exprEndsIndex + ENDING_BOUND.length
    };
}

function pickStr(words, startsPos) {
    let strEndsIndex = words.indexOf(STARTING_BOUND, startsPos);
    let content;

    if (!~strEndsIndex) {
        strEndsIndex = words.length;
    }

    content = words.substring(startsPos, strEndsIndex);
    if (content) {
        content = '"' + content + '"';
    }
    return {
        content,
        pos: strEndsIndex
    };
}

export function starts(words) {
    return words.startsWith(STARTING_BOUND);
}

export function ends(words) {
    return words.startsWith(ENDING_BOUND);
}

export function contains(words = '') {
    return words.includes(STARTING_BOUND) && words.includes(ENDING_BOUND);
}

export function getBoundsSize() {
    return {
        start: STARTING_BOUND.length,
        end: ENDING_BOUND.length
    };
}

export function setBounds({ start, end }) {
    STARTING_BOUND = start;
    ENDING_BOUND = end;
}

export function expression(words = '') {
    if (contains(words)) {
        let stack = [];
        let i = 0;

        while (i < words.length) {
            const { content, pos } = starts(words.substr(i))
                ? pickExpr(words, i)
                : pickStr(words, i);
            if (content) stack.push(content);
            i = pos;
        }

        return parse(stack.join('+'));
    } else {
        return parse(words);
    }
}
