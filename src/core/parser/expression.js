import parse from '../../../lib/jsep';

let STARTING_BOUND = '{{';
let ENDING_BOUND = '}}';

function splitExpressionContent(source, startsPos) {
    const exprCloseBoundsIndex = source.indexOf(ENDING_BOUND, startsPos);
    const content =
        '(' +
        source.substring(
            startsPos + STARTING_BOUND.length,
            exprCloseBoundsIndex
        ) +
        ')';

    return {
        content,
        pos: exprCloseBoundsIndex + ENDING_BOUND.length
    };
}

function splitStringContent(source, startsPos) {
    let stringEndIndex = source.indexOf(STARTING_BOUND, startsPos);
    if (!~stringEndIndex) {
        stringEndIndex = source.length;
    }
    let content = source.substring(startsPos, stringEndIndex);
    if (content) {
        content = '"' + content + '"';
    }
    return {
        content,
        pos: stringEndIndex
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

export function expression(source = '') {
    if (contains(source)) {
        let stack = [];
        let i = 0;
        while (i < source.length) {
            const { content, pos } = starts(source.substr(i))
                ? splitExpressionContent(source, i)
                : splitStringContent(source, i);
            if (content) stack.push(content);
            i = pos;
        }
        return parse(stack.join('+'));
    } else {
        return parse(source);
    }
}
