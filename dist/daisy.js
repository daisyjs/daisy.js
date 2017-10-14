(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Daisy = factory());
}(this, (function () { 'use strict';

const COMMENT = 'COMMENT';
const CLOSE_TAG = 'CLOSE_TAG';
const END_TAG = 'END_TAG';
const TAGNAME = 'TAGNAME';

const EXPR = 'EXPR';
const TEXT = 'TEXT';
const ATTR = 'ATTR';

const VALUE = 'VALUE';
const EOF = 'EOF';

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

// A-Z

// a-zA-Z

//  0-9

// _

// $

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
 //console.log('debug:', message);

// eslint-disable-next-line
const warn = (message) => console.warn(message);
// eslint-disable-next-line
const error = (message) => console.error(message);

const isEmpty = o => Object.keys(o).length === 0;
const isObject = o => o != null && typeof o === 'object';
const properObject = o => isObject(o) && !o.hasOwnProperty ? Object.assign({}, o) : o;
const isDate = d => d instanceof Date;


const getDirective = (pattern, directives) => {
    const filtered = directives.filter(({test}) => {
        return test(pattern);
    });

    if (filtered.length === 0) {
        throw new Error(`cannt find the directive ${pattern}!`);
    } else {
        return filtered[0].handler;
    }
};

const createDirective = ({name, value: handler}) => {
    const isRegExpLike = (item) => item.startsWith('/') && item.endsWith('/');
    const createRegExp = (item) => new RegExp(item.slice(1, item.length-1));
    return {
        test: isRegExpLike(name) ? 
            (pattern) => createRegExp(name).test(pattern)
            : (pattern) => {
                return name === pattern;
            },
        handler
    };
};

const createEvent = ({name, value: handler}) => ({
    name: name,
    handler
});

const getProppertyObject = (list) => {
    return list.reduce((prev, {name, value}) => {
        return Object.assign(prev, {
            [name]: value
        });
    }, {});
};

const getRootElement = (element) => {
    while (element.context) {
        element = element.context;
    }
    return element;
};


function isPrimitive(value) {
    return value === null || (typeof value !== 'function' && typeof value !== 'object');
}


const isNull =  (target) => target[name] === void 0 || target[name] === null;

const assignPrimitive = (target, changed) => {
    for (let name in changed) {
        if (changed.hasOwnProperty(name)) {
            const changedValue = changed[name];

            if (isPrimitive(changedValue) || isNull(target[name])) {
                target[name] = changedValue;
            } else {
                assignPrimitive(target[name], changedValue);
            }
        }
    }
};


const uid = () => {
    let id =  -1;
    return () => {
        return ++id;
    };
};

const mixin = (klass, impl) => {
    return Object.assign(klass.prototype, impl);
};

const noop = () => {};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var jsep = createCommonjsModule(function (module, exports) {
//     JavaScript Expression Parser (JSEP) <%= version %>
//     JSEP may be freely distributed under the MIT License
//     http://jsep.from.so/

/*global module: true, exports: true, console: true */
(function (root) {
    'use strict';
    // Node Types
    // ----------

    // This is the full set of types that any JSEP node can be.
    // Store them here to save space when minified
    var COMPOUND = 'Compound',
        IDENTIFIER = 'Identifier',
        MEMBER_EXP = 'MemberExpression',
        LITERAL = 'Literal',
        THIS_EXP = 'ThisExpression',
        CALL_EXP = 'CallExpression',
        UNARY_EXP = 'UnaryExpression',
        BINARY_EXP = 'BinaryExpression',
        LOGICAL_EXP = 'LogicalExpression',
        CONDITIONAL_EXP = 'ConditionalExpression',
        ARRAY_EXP = 'ArrayExpression',

        PERIOD_CODE = 46, // '.'
        COMMA_CODE  = 44, // ','
        SQUOTE_CODE = 39, // single quote
        DQUOTE_CODE = 34, // double quotes
        OPAREN_CODE = 40, // (
        CPAREN_CODE = 41, // )
        OBRACK_CODE = 91, // [
        CBRACK_CODE = 93, // ]
        QUMARK_CODE = 63, // ?
        SEMCOL_CODE = 59, // ;
        COLON_CODE  = 58, // :

        throwError = function(message, index) {
            var error = new Error(message + ' at character ' + index);
            error.index = index;
            error.description = message;
            throw error;
        },

        // Operations
        // ----------

        // Set `t` to `true` to save space (when minified, not gzipped)
        t = true,
        // Use a quickly-accessible map to store all of the unary operators
        // Values are set to `true` (it really doesn't matter)
        unary_ops = {'-': t, '!': t, '~': t, '+': t},
        // Also use a map for the binary operations but set their values to their
        // binary precedence for quick reference:
        // see [Order of operations](http://en.wikipedia.org/wiki/Order_of_operations#Programming_language)
        binary_ops = {
            '||': 1, '&&': 2, '|': 3,  '^': 4,  '&': 5,
            '==': 6, '!=': 6, '===': 6, '!==': 6,
            '<': 7,  '>': 7,  '<=': 7,  '>=': 7,
            '<<':8,  '>>': 8, '>>>': 8,
            '+': 9, '-': 9,
            '*': 10, '/': 10, '%': 10
        },
        // Get return the longest key length of any object
        getMaxKeyLen = function(obj) {
            var max_len = 0, len;
            for(var key in obj) {
                if((len = key.length) > max_len && obj.hasOwnProperty(key)) {
                    max_len = len;
                }
            }
            return max_len;
        },
        max_unop_len = getMaxKeyLen(unary_ops),
        max_binop_len = getMaxKeyLen(binary_ops),
        // Literals
        // ----------
        // Store the values to return for the various literals we may encounter
        literals = {
            'true': true,
            'false': false,
            'null': null
        },
        // Except for `this`, which is special. This could be changed to something like `'self'` as well
        this_str = 'this',
        // Returns the precedence of a binary operator or `0` if it isn't a binary operator
        binaryPrecedence = function(op_val) {
            return binary_ops[op_val] || 0;
        },
        // Utility function (gets called from multiple places)
        // Also note that `a && b` and `a || b` are *logical* expressions, not binary expressions
        createBinaryExpression = function (operator, left, right) {
            var type = (operator === '||' || operator === '&&') ? LOGICAL_EXP : BINARY_EXP;
            return {
                type: type,
                operator: operator,
                left: left,
                right: right
            };
        },
        // `ch` is a character code in the next three functions
        isDecimalDigit = function(ch) {
            return (ch >= 48 && ch <= 57); // 0...9
        },
        isIdentifierStart = function(ch) {
            return (ch === 36) || (ch === 95) || // `$` and `_`
     (ch >= 65 && ch <= 90) || // A...Z
     (ch >= 97 && ch <= 122) || // a...z
                    (ch >= 128 && !binary_ops[String.fromCharCode(ch)]); // any non-ASCII that is not an operator
        },
        isIdentifierPart = function(ch) {
            return (ch === 36) || (ch === 95) || // `$` and `_`
     (ch >= 65 && ch <= 90) || // A...Z
     (ch >= 97 && ch <= 122) || // a...z
     (ch >= 48 && ch <= 57) || // 0...9
                    (ch >= 128 && !binary_ops[String.fromCharCode(ch)]); // any non-ASCII that is not an operator
        },

        // Parsing
        // -------
        // `expr` is a string with the passed in expression
        jsep = function(expr) {
            // `index` stores the character number we are currently at while `length` is a constant
            // All of the gobbles below will modify `index` as we move along
            var index = 0,
                charAtFunc = expr.charAt,
                charCodeAtFunc = expr.charCodeAt,
                exprI = function(i) { return charAtFunc.call(expr, i); },
                exprICode = function(i) { return charCodeAtFunc.call(expr, i); },
                length = expr.length,

                // Push `index` up to the next non-space character
                gobbleSpaces = function() {
                    var ch = exprICode(index);
                    // space or tab
                    while(ch === 32 || ch === 9 || ch === 10 || ch === 13) {
                        ch = exprICode(++index);
                    }
                },

                // The main parsing function. Much of this code is dedicated to ternary expressions
                gobbleExpression = function() {
                    var test = gobbleBinaryExpression(),
                        consequent, alternate;
                    gobbleSpaces();
                    if(exprICode(index) === QUMARK_CODE) {
                        // Ternary expression: test ? consequent : alternate
                        index++;
                        consequent = gobbleExpression();
                        if(!consequent) {
                            throwError('Expected expression', index);
                        }
                        gobbleSpaces();
                        if(exprICode(index) === COLON_CODE) {
                            index++;
                            alternate = gobbleExpression();
                            if(!alternate) {
                                throwError('Expected expression', index);
                            }
                            return {
                                type: CONDITIONAL_EXP,
                                test: test,
                                consequent: consequent,
                                alternate: alternate
                            };
                        } else {
                            throwError('Expected :', index);
                        }
                    } else {
                        return test;
                    }
                },

                // Search for the operation portion of the string (e.g. `+`, `===`)
                // Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
                // and move down from 3 to 2 to 1 character until a matching binary operation is found
                // then, return that binary operation
                gobbleBinaryOp = function() {
                    gobbleSpaces();
                    var biop, to_check = expr.substr(index, max_binop_len), tc_len = to_check.length;
                    while(tc_len > 0) {
                        if(binary_ops.hasOwnProperty(to_check)) {
                            index += tc_len;
                            return to_check;
                        }
                        to_check = to_check.substr(0, --tc_len);
                    }
                    return false;
                },

                // This function is responsible for gobbling an individual expression,
                // e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
                gobbleBinaryExpression = function() {
                    var ch_i, node, biop, prec, stack, biop_info, left, right, i;

                    // First, try to get the leftmost thing
                    // Then, check to see if there's a binary operator operating on that leftmost thing
                    left = gobbleToken();
                    biop = gobbleBinaryOp();

                    // If there wasn't a binary operator, just return the leftmost node
                    if(!biop) {
                        return left;
                    }

                    // Otherwise, we need to start a stack to properly place the binary operations in their
                    // precedence structure
                    biop_info = { value: biop, prec: binaryPrecedence(biop)};

                    right = gobbleToken();
                    if(!right) {
                        throwError('Expected expression after ' + biop, index);
                    }
                    stack = [left, biop_info, right];

                    // Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
                    while((biop = gobbleBinaryOp())) {
                        prec = binaryPrecedence(biop);

                        if(prec === 0) {
                            break;
                        }
                        biop_info = { value: biop, prec: prec };

                        // Reduce: make a binary expression from the three topmost entries.
                        while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                            right = stack.pop();
                            biop = stack.pop().value;
                            left = stack.pop();
                            node = createBinaryExpression(biop, left, right);
                            stack.push(node);
                        }

                        node = gobbleToken();
                        if(!node) {
                            throwError('Expected expression after ' + biop, index);
                        }
                        stack.push(biop_info, node);
                    }

                    i = stack.length - 1;
                    node = stack[i];
                    while(i > 1) {
                        node = createBinaryExpression(stack[i - 1].value, stack[i - 2], node);
                        i -= 2;
                    }
                    return node;
                },

                // An individual part of a binary expression:
                // e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
                gobbleToken = function() {
                    var ch, to_check, tc_len;

                    gobbleSpaces();
                    ch = exprICode(index);

                    if(isDecimalDigit(ch) || ch === PERIOD_CODE) {
                        // Char code 46 is a dot `.` which can start off a numeric literal
                        return gobbleNumericLiteral();
                    } else if(ch === SQUOTE_CODE || ch === DQUOTE_CODE) {
                        // Single or double quotes
                        return gobbleStringLiteral();
                    } else if (ch === OBRACK_CODE) {
                        return gobbleArray();
                    } else {
                        to_check = expr.substr(index, max_unop_len);
                        tc_len = to_check.length;
                        while(tc_len > 0) {
                            if(unary_ops.hasOwnProperty(to_check)) {
                                index += tc_len;
                                return {
                                    type: UNARY_EXP,
                                    operator: to_check,
                                    argument: gobbleToken(),
                                    prefix: true
                                };
                            }
                            to_check = to_check.substr(0, --tc_len);
                        }

                        if (isIdentifierStart(ch) || ch === OPAREN_CODE) { // open parenthesis
                            // `foo`, `bar.baz`
                            return gobbleVariable();
                        }
                    }

                    return false;
                },
                // Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
                // keep track of everything in the numeric literal and then calling `parseFloat` on that string
                gobbleNumericLiteral = function() {
                    var number = '', ch, chCode;
                    while(isDecimalDigit(exprICode(index))) {
                        number += exprI(index++);
                    }

                    if(exprICode(index) === PERIOD_CODE) { // can start with a decimal marker
                        number += exprI(index++);

                        while(isDecimalDigit(exprICode(index))) {
                            number += exprI(index++);
                        }
                    }

                    ch = exprI(index);
                    if(ch === 'e' || ch === 'E') { // exponent marker
                        number += exprI(index++);
                        ch = exprI(index);
                        if(ch === '+' || ch === '-') { // exponent sign
                            number += exprI(index++);
                        }
                        while(isDecimalDigit(exprICode(index))) { //exponent itself
                            number += exprI(index++);
                        }
                        if(!isDecimalDigit(exprICode(index-1)) ) {
                            throwError('Expected exponent (' + number + exprI(index) + ')', index);
                        }
                    }


                    chCode = exprICode(index);
                    // Check to make sure this isn't a variable name that start with a number (123abc)
                    if(isIdentifierStart(chCode)) {
                        throwError('Variable names cannot start with a number (' +
         number + exprI(index) + ')', index);
                    } else if(chCode === PERIOD_CODE) {
                        throwError('Unexpected period', index);
                    }

                    return {
                        type: LITERAL,
                        value: parseFloat(number),
                        raw: number
                    };
                },

                // Parses a string literal, staring with single or double quotes with basic support for escape codes
                // e.g. `"hello world"`, `'this is\nJSEP'`
                gobbleStringLiteral = function() {
                    var str = '', quote = exprI(index++), closed = false, ch;

                    while(index < length) {
                        ch = exprI(index++);
                        if(ch === quote) {
                            closed = true;
                            break;
                        } else if(ch === '\\') {
                            // Check for all of the common escape codes
                            ch = exprI(index++);
                            switch(ch) {
                            case 'n': str += '\n'; break;
                            case 'r': str += '\r'; break;
                            case 't': str += '\t'; break;
                            case 'b': str += '\b'; break;
                            case 'f': str += '\f'; break;
                            case 'v': str += '\x0B'; break;
                            default : str += ch;
                            }
                        } else {
                            str += ch;
                        }
                    }

                    if(!closed) {
                        throwError('Unclosed quote after "'+str+'"', index);
                    }

                    return {
                        type: LITERAL,
                        value: str,
                        raw: quote + str + quote
                    };
                },

                // Gobbles only identifiers
                // e.g.: `foo`, `_value`, `$x1`
                // Also, this function checks if that identifier is a literal:
                // (e.g. `true`, `false`, `null`) or `this`
                gobbleIdentifier = function() {
                    var ch = exprICode(index), start = index, identifier;

                    if(isIdentifierStart(ch)) {
                        index++;
                    } else {
                        throwError('Unexpected ' + exprI(index), index);
                    }

                    while(index < length) {
                        ch = exprICode(index);
                        if(isIdentifierPart(ch)) {
                            index++;
                        } else {
                            break;
                        }
                    }
                    identifier = expr.slice(start, index);

                    if(literals.hasOwnProperty(identifier)) {
                        return {
                            type: LITERAL,
                            value: literals[identifier],
                            raw: identifier
                        };
                    } else if(identifier === this_str) {
                        return { type: THIS_EXP };
                    } else {
                        return {
                            type: IDENTIFIER,
                            name: identifier
                        };
                    }
                },

                // Gobbles a list of arguments within the context of a function call
                // or array literal. This function also assumes that the opening character
                // `(` or `[` has already been gobbled, and gobbles expressions and commas
                // until the terminator character `)` or `]` is encountered.
                // e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
                gobbleArguments = function(termination) {
                    var ch_i, args = [], node, closed = false;
                    while(index < length) {
                        gobbleSpaces();
                        ch_i = exprICode(index);
                        if(ch_i === termination) { // done parsing
                            closed = true;
                            index++;
                            break;
                        } else if (ch_i === COMMA_CODE) { // between expressions
                            index++;
                        } else {
                            node = gobbleExpression();
                            if(!node || node.type === COMPOUND) {
                                throwError('Expected comma', index);
                            }
                            args.push(node);
                        }
                    }
                    if (!closed) {
                        throwError('Expected ' + String.fromCharCode(termination), index);
                    }
                    return args;
                },

                // Gobble a non-literal variable name. This variable name may include properties
                // e.g. `foo`, `bar.baz`, `foo['bar'].baz`
                // It also gobbles function calls:
                // e.g. `Math.acos(obj.angle)`
                gobbleVariable = function() {
                    var ch_i, node;
                    ch_i = exprICode(index);

                    if(ch_i === OPAREN_CODE) {
                        node = gobbleGroup();
                    } else {
                        node = gobbleIdentifier();
                    }
                    gobbleSpaces();
                    ch_i = exprICode(index);
                    while(ch_i === PERIOD_CODE || ch_i === OBRACK_CODE || ch_i === OPAREN_CODE) {
                        index++;
                        if(ch_i === PERIOD_CODE) {
                            gobbleSpaces();
                            node = {
                                type: MEMBER_EXP,
                                computed: false,
                                object: node,
                                property: gobbleIdentifier()
                            };
                        } else if(ch_i === OBRACK_CODE) {
                            node = {
                                type: MEMBER_EXP,
                                computed: true,
                                object: node,
                                property: gobbleExpression()
                            };
                            gobbleSpaces();
                            ch_i = exprICode(index);
                            if(ch_i !== CBRACK_CODE) {
                                throwError('Unclosed [', index);
                            }
                            index++;
                        } else if(ch_i === OPAREN_CODE) {
                            // A function call is being made; gobble all the arguments
                            node = {
                                type: CALL_EXP,
                                'arguments': gobbleArguments(CPAREN_CODE),
                                callee: node
                            };
                        }
                        gobbleSpaces();
                        ch_i = exprICode(index);
                    }
                    return node;
                },

                // Responsible for parsing a group of things within parentheses `()`
                // This function assumes that it needs to gobble the opening parenthesis
                // and then tries to gobble everything within that parenthesis, assuming
                // that the next thing it should see is the close parenthesis. If not,
                // then the expression probably doesn't have a `)`
                gobbleGroup = function() {
                    index++;
                    var node = gobbleExpression();
                    gobbleSpaces();
                    if(exprICode(index) === CPAREN_CODE) {
                        index++;
                        return node;
                    } else {
                        throwError('Unclosed (', index);
                    }
                },

                // Responsible for parsing Array literals `[1, 2, 3]`
                // This function assumes that it needs to gobble the opening bracket
                // and then tries to gobble the expressions as arguments.
                gobbleArray = function() {
                    index++;
                    return {
                        type: ARRAY_EXP,
                        elements: gobbleArguments(CBRACK_CODE)
                    };
                },

                nodes = [], ch_i, node;

            while(index < length) {
                ch_i = exprICode(index);

                // Expressions can be separated by semicolons, commas, or just inferred without any
                // separators
                if(ch_i === SEMCOL_CODE || ch_i === COMMA_CODE) {
                    index++; // ignore separators
                } else {
                    // Try to gobble each expression individually
                    if((node = gobbleExpression())) {
                        nodes.push(node);
                        // If we weren't able to find a binary expression and are out of room, then
                        // the expression passed in probably has too much
                    } else if(index < length) {
                        throwError('Unexpected "' + exprI(index) + '"', index);
                    }
                }
            }

            // If there's only one expression just try returning the expression
            if(nodes.length === 1) {
                return nodes[0];
            } else {
                return {
                    type: COMPOUND,
                    body: nodes
                };
            }
        };

    // To be filled in by the template
    jsep.version = '<%= version %>';
    jsep.toString = function() { return 'JavaScript Expression Parser (JSEP) v' + jsep.version; };

    /**
	 * @method jsep.addUnaryOp
	 * @param {string} op_name The name of the unary op to add
	 * @return jsep
	 */
    jsep.addUnaryOp = function(op_name) {
        max_unop_len = Math.max(op_name.length, max_unop_len);
        unary_ops[op_name] = t; return this;
    };

    /**
	 * @method jsep.addBinaryOp
	 * @param {string} op_name The name of the binary op to add
	 * @param {number} precedence The precedence of the binary op (can be a float)
	 * @return jsep
	 */
    jsep.addBinaryOp = function(op_name, precedence) {
        max_binop_len = Math.max(op_name.length, max_binop_len);
        binary_ops[op_name] = precedence;
        return this;
    };

    /**
	 * @method jsep.addLiteral
	 * @param {string} literal_name The name of the literal to add
	 * @param {*} literal_value The value of the literal
	 * @return jsep
	 */
    jsep.addLiteral = function(literal_name, literal_value) {
        literals[literal_name] = literal_value;
        return this;
    };

    /**
	 * @method jsep.removeUnaryOp
	 * @param {string} op_name The name of the unary op to remove
	 * @return jsep
	 */
    jsep.removeUnaryOp = function(op_name) {
        delete unary_ops[op_name];
        if(op_name.length === max_unop_len) {
            max_unop_len = getMaxKeyLen(unary_ops);
        }
        return this;
    };

    /**
	 * @method jsep.removeAllUnaryOps
	 * @return jsep
	 */
    jsep.removeAllUnaryOps = function() {
        unary_ops = {};
        max_unop_len = 0;

        return this;
    };

    /**
	 * @method jsep.removeBinaryOp
	 * @param {string} op_name The name of the binary op to remove
	 * @return jsep
	 */
    jsep.removeBinaryOp = function(op_name) {
        delete binary_ops[op_name];
        if(op_name.length === max_binop_len) {
            max_binop_len = getMaxKeyLen(binary_ops);
        }
        return this;
    };

    /**
	 * @method jsep.removeAllBinaryOps
	 * @return jsep
	 */
    jsep.removeAllBinaryOps = function() {
        binary_ops = {};
        max_binop_len = 0;

        return this;
    };

    /**
	 * @method jsep.removeLiteral
	 * @param {string} literal_name The name of the literal to remove
	 * @return jsep
	 */
    jsep.removeLiteral = function(literal_name) {
        delete literals[literal_name];
        return this;
    };

    /**
	 * @method jsep.removeAllLiterals
	 * @return jsep
	 */
    jsep.removeAllLiterals = function() {
        literals = {};

        return this;
    };

    // In desktop environments, have a way to restore the old value for `jsep`
    {
        // In Node.JS environments
        if ('object' !== 'undefined' && module.exports) {
            exports = module.exports = jsep;
        } else {
            exports.parse = jsep;
        }
    }
}(commonjsGlobal));
});

let EXPR_OPEN_BOUNDS = '{{';
let EXPR_CLOSE_BOUNDS = '}}';

function ParseExpression(source) {
    return jsep(source);
}

function isStartsWithExprOpenBounds(source, pos) {
    return source.startsWith(EXPR_OPEN_BOUNDS, pos);
}

function splitExpressionContent(source, startsPos) {
    const exprCloseBoundsIndex = source.indexOf(EXPR_CLOSE_BOUNDS, startsPos);
    const content = '(' + source.substring(startsPos + EXPR_OPEN_BOUNDS.length, exprCloseBoundsIndex) + ')';

    return {
        content,
        pos: exprCloseBoundsIndex + EXPR_CLOSE_BOUNDS.length
    };
}

function splitStringContent(source, startsPos) {
    let stringEndIndex = source.indexOf(EXPR_OPEN_BOUNDS, startsPos);
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

// {
function isOpenExpr(letter = '', nextLetter = '') {
    return [letter, nextLetter].join('').indexOf(EXPR_OPEN_BOUNDS) === 0;
}

// }
function isCloseExpr(letter = '', nextLetter = '') {
    return [letter, nextLetter].join('').indexOf(EXPR_CLOSE_BOUNDS) === 0;
}

// includes {{ }}
function isIncludeExpr(words = '') {
    return words.includes(EXPR_OPEN_BOUNDS) && words.includes(EXPR_CLOSE_BOUNDS);
}

function getExpressionBounds() {
    return {
        open: EXPR_OPEN_BOUNDS,
        close: EXPR_CLOSE_BOUNDS
    };
}




function Expression(source = '') {
    if (isIncludeExpr(source)) {
        let stack = [];
        let i = 0;
        while (i < source.length) {
            const {
                content,
                pos
            } = isStartsWithExprOpenBounds(source, i) ? splitExpressionContent(source, i) : splitStringContent(source, i);
            if (content)
                stack.push(content);
            i = pos;
        }
        return ParseExpression(stack.join('+'));
    } else {
        return ParseExpression(source);
    }
}

function createToken(tokenType, temp = []) {
    const content = temp.join('');
    return {
        type: tokenType,
        content
    };
}

function Lexer(source) {
    let pos = 0;
    let tokens = [];
    let length = source.length;
    const {open: EXPR_OPEN_BOUNDS, close: EXPR_CLOSE_BOUNDS} = getExpressionBounds();


    function consumeSpaces(pos) {
        while (isSpace(source[pos])) {pos++;}
        return {pos};
    }

    function consumeCloseTag(pos) {
        let letter = source[pos];
        let next = source[pos + 1];
        if (isSlash(letter) && isCloseTag(next)) {
            return {
                pos: pos + 2,
                isSelfClose: true
            };
        } else if (isCloseTag(letter)) {
            return {
                pos: pos + 1,
                isSelfClose: false
            };
        }
    }

    function consumeValue(pos) {
        let letter = source[pos];
        let temp = [];

        if (isQuote(letter)) {
            temp.push(letter);
            pos++;
            while (pos < length) {
                letter = source[pos];
                if (
                    isQuote(letter) && letter === temp[0] && source[pos - 1] !== '\\'
                ) {
                    temp.push(letter);
                    return {
                        pos: pos + 1,
                        token: createToken(VALUE, temp.slice(1, temp.length-1)) // remove ^" "$
                    };
                } else {
                    temp.push(letter);
                    pos++;
                }
            }
        } else {
            while (pos < length) {
                letter = source[pos];
                let closeTagResult;
                if (isSpace(letter)) {
                    pos++;
                    return {
                        pos: pos,
                        token: createToken(VALUE, temp)
                    };
                    // eslint-disable-next-line
                } else if (closeTagResult = consumeCloseTag(pos)) {
                    if (temp.length > 0) {
                        const token = createToken(VALUE, temp);
                        return {
                            pos: pos,
                            token: closeTagResult.isSelfClose ? setTokenSelfClose(token): token
                        };
                    } else {
                        return;
                    }
                } else {
                    temp.push(letter);
                    pos++;
                }
            }
        }
    }

    function consumeAttrs(pos) {
        let letter = source[pos];
        let temp = [];
        const group = [];

        while (pos < length) {
            letter = source[pos];
            if (isEqual(letter)) {
                if (temp.length > 0) {
                    group.push(createToken(ATTR, temp));
                    temp.length = 0;
                }
                pos ++;
                pos = consumeSpaces(pos).pos;

                const {pos: posNext, token} = (consumeExpression(pos) || consumeValue(pos)) || {};

                if (token) {
                    group.push(token);
                    pos = posNext;
                }

            } else if (
                consumeCloseTag(pos)
            ) {
                if (temp.length > 0) {
                    group.push(createToken(ATTR, temp));
                    temp.length = 0;
                }
                return {
                    pos: pos,
                    token: group
                };
            } else if (isSpace(letter)) {
                pos = consumeSpaces(pos).pos;
                if (temp.length > 0) {
                    group.push(createToken(ATTR, temp));
                    temp.length = 0;
                }
            } else {
                temp.push(letter);
                pos++;
            }
        }
    }

    function consumeTag(pos) {
        let letter = source[pos];
        let temp = [];
        let group = [];

        if (isOpenTag(letter)
        && !isSlash(source[pos + 1])
        && !isSpace(source[pos + 1])
        && !isOpenTag(source[pos + 1])
        && !isCloseTag(source[pos + 1])
        ) {
            ++pos;
            while (pos < length) {
                letter = source[pos];
                const {pos: posCloseTag, isSelfClose: isSelfClose$$1} = consumeCloseTag(pos) || {};

                if (posCloseTag) {
                    if (group.length === 0) {
                        group = [
                            createToken(TAGNAME, temp)
                        ];
                    }

                    if (isSelfClose$$1) {
                        group[0] = setTokenSelfClose(group[0]);
                    }

                    group.push(createToken(CLOSE_TAG));

                    return {
                        pos: posCloseTag,
                        token: group
                    };
                }

                if (isSpace(letter)) {
                    pos = consumeSpaces(pos).pos;

                    group = [
                        createToken(TAGNAME, temp)
                    ];

                    let {token: attrs, pos: posAttrs} = consumeAttrs(pos) || {};

                    if (attrs) {
                        group = [
                            ...group, ...attrs
                        ];
                        pos = posAttrs;
                    }

                    pos = consumeSpaces(pos).pos;
                } else {
                    temp.push(letter);
                    ++pos;
                }
            }
        }
    }

    function consumeEndTag(pos) {
        let letter = source[pos];
        let temp = [];

        if (
            isOpenTag(letter) && isSlash(source[pos + 1]) &&
        (
            !isSpace(source[pos + 2]) &&
          !isOpenTag(source[pos + 2])
        )
        ) {
            pos += 2;

            while (pos < length) {
                letter = source[pos];
                // eslint-disable-next-line
                if (isSpace(letter)) {
                    pos = consumeSpaces(pos).pos;
                }
                else if (isCloseTag(letter)) {
                    const token = createToken(END_TAG, temp);
                    return {
                        pos: pos + 1,
                        token: token
                    };
                } else {
                    temp.push(letter);
                    pos ++;
                }
            }
        }
    }

    function consumeComment(pos) {
        let letter = source[pos];
        let temp = [];

        if (isOpenTag(letter)
          && isExclamationMark(source[++pos])
          && isDash(source[++pos])
          && isDash(source[++pos])) {
            ++pos;
            while (pos < length) {
                letter = source[pos];
                if (isDash(letter) && isDash(source[pos + 1]) && isCloseTag(source[pos + 2])) {
                    return {
                        pos: pos + 3,
                        token: createToken(COMMENT, temp)
                    };
                } else {
                    temp.push(letter);
                    pos ++;
                }
            }

            return {
                pos,
                token: createToken(COMMENT, temp)
            };
        }
    }

    function consumeText(pos) {
        let letter = source[pos];
        let temp = [];

        temp.push(letter);
        pos++;
        while (pos < length) {
            letter = source[pos];
            if (isOpenTag(letter) || isOpenExpr(letter, source[pos + 1])) {
                return {
                    pos: pos,
                    token: createToken(TEXT, temp)
                };
            } else {
                temp.push(letter);
                pos++;
            }
        }

        return {
            pos,
            token: createToken(TEXT, temp)
        };
    }

    function consumeExpression(pos) {
        let letter = source[pos];
        let temp = [];
        if (isOpenExpr(letter, source[pos + 1])) {
            pos += EXPR_OPEN_BOUNDS.length;
            while (pos < length) {
                letter = source[pos];
                if (
                    isOpenExpr(letter, source[pos + 1])
                ) {
                    return false;
                } else if (
                    isCloseExpr(letter, source[pos + 1])
                ) {
                    pos += EXPR_CLOSE_BOUNDS.length;
                    return {
                        pos: pos,
                        token: createToken(EXPR, temp)
                    };
                } else {
                    temp.push(letter);
                    pos++;
                }
            }
        }
    }

    function setTokenSelfClose(token) {
        return Object.assign(token, {
            isSelfClose: true
        });
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

    /* eslint-disable */
    while (pos < length) {
        const refs = consumeEndTag(pos) || consumeComment(pos) || consumeTag(pos) || consumeExpression(pos) || consumeText(pos);

        if (!refs) {
            throw new Error('no avaliable token:\n' + source.substr(pos));
        } else {
            const {pos: posNext, token} = refs;
            if (Array.isArray(token)) {
                pos = posNext;
                tokens = [
                    ...tokens, ...token
                ];
            } else if (typeof token === 'object') {
                pos = posNext;
                tokens.push(token);
            }
        }
    }

    tokens = mergeTextTokens();

    tokens = [...tokens, {
        type: EOF
    }];

    let refs = isTagClosed(tokens);
    if (refs.message) {
        throw refs.message;
    }

    return tokens;
}

const Types = {
    Program: 'Program',
    If: 'If',
    For: 'For',
    Element: 'Element',
    Attribute: 'Attribute',
    Expression: 'Expression',
    Text: 'Text',
    Comment: 'Comment',
    Include: 'Include'
};

function Program(body) {
    return {
        type: Types.Program,
        body
    };
}

function If(test, consequent, alternate) {
    return {
        type: Types.If,
        test,
        alternate,
        consequent,
    };
}

function For(test, init, body) {
    return {
        type: Types.For,
        test,
        init,
        body,
    };
}

function Element(name, attributes = [], directives = [], children = []) {
    return {
        type: Types.Element,
        name,
        attributes,
        directives,
        children
    };
}

function Include(expression) {
    return {
        type: Types.Include,
        expression
    };
}

function Attribute(name, value) {
    return {
        type: Types.Attribute,
        name,
        value
    };
}

function Expression$1(value) {
    return {
        type: Types.Expression,
        value
    };
}

function Text (text) {
    return {
        type: Types.Text,
        value: text
    };
}

function Comment(comment) {
    return {
        type: Types.Comment,
        value: comment
    };
}

const STATEMENT_MARK = ':';
const DIRECTIVE_MARK = '@';
const IF_STATEMENT = `${STATEMENT_MARK}if`;
const INCLUDE_STATEMENT = `${STATEMENT_MARK}include`;
const ELSE_STATEMENT = `${STATEMENT_MARK}else`;
const ELSE_IF_STATEMENT = `${STATEMENT_MARK}elif`;
const FOR_STATEMENT = `${STATEMENT_MARK}for`;
const FOR_ITEM_STATEMENT = `${STATEMENT_MARK}for-item`;
const FOR_ITEM_INDEX_STATEMENT = `${STATEMENT_MARK}for-index`;

function Parser(source) {
    let tokens;

    try {
        tokens = Lexer(source);
    } catch (e) {
        return error('Error in Lexer: \n' + (e.stack || e));
    }

    let pos = 0;

    return Program(program(tokens));

    function ll(k = 0) {
        pos += k;

        if (pos > tokens.length - 1){
            return tokens[tokens.length - 1];
        }

        return tokens[pos];
    }

    function la(...args) {
        return ll(...args).type;
    }

    function program() {
        return doPackage(type => type !== END_TAG && type !== EOF);
    }

    function doPackage(condition) {
        const body = [];
        while (
            condition(la())
        ) {
            const node = recurse(body);

            if (node) {
                body.push(node);
            }
        }
        return body;
    }


    function recurse(nodes) {
        const token = ll();
        const {type} = token;
        switch (type) {
        case TAGNAME:
            return element(nodes);
        case TEXT:
            return text();
        case EXPR:
            return expr();
        case COMMENT:
            return comment();
        default:
            
            throw 'unknow token type!';
        }
    }

    function text() {
        const {content} = ll();
        next();
        return Text(content);
    }

    function comment() {
        const {content} = ll();
        next();
        return Comment(content);
    }

    function element(nodes) {
        const token = ll();
        const {content} = token;

        next();

        let children, directives, statements;
        let attrNodes = attrs();

        const refs = regenerateAttrs(attrNodes);

        attrNodes = refs.attrs;
        directives = refs.directives;
        statements = refs.statements;

        consume(CLOSE_TAG);

        if (!isSelfClose(token) && !isVoidTag(content)) {
            children = program();
        }

        let element = Element(
            content, attrNodes, directives, children
        );

        const ifNodeList = nodes.filter(({type}) => {
            return type === Types.If;
        });

        element = wrapIncludeStatement(element, statements);
        
        const lastIfNode = ifNodeList[ifNodeList.length - 1];

        element = wrapElseStatement(element, statements, lastIfNode);

        if (element) {
            element = wrapIfStatement(element, statements);
        } else {
            nodes.splice(nodes.indexOf(lastIfNode) + 1);
        }

        element = wrapForStatement(element, statements);
        

        consume(END_TAG);

        return element;
    }

    function wrapIncludeStatement(element, statements) {
        const inludesValue = statements[INCLUDE_STATEMENT];
        if (inludesValue) {
            return Include(inludesValue);
        }
        return element;
    }

    function wrapElseStatement (element, statements, lastIfNode) {
        let elseIfValue = statements[ELSE_IF_STATEMENT];

        const keys = Object.keys(statements);

        if (lastIfNode) {
            // find the empty alternate
            while (lastIfNode.alternate) {
                lastIfNode = lastIfNode.alternate;
            }

            if (keys.includes(ELSE_STATEMENT)) {
                lastIfNode.alternate = element;
                return null;
            } else if (elseIfValue) {
                lastIfNode.alternate = If(elseIfValue, element);
                return null;
            }
        }

        return element;
    }

    function wrapIfStatement(element, statements) {
        let value = statements[IF_STATEMENT];
        if (value) {
            return If(value, element);
        }
        return element;
    }

    function wrapForStatement(element, statements) {
        let value = statements[FOR_STATEMENT];
        if (value) {
            return For(value, {
                item: statements[FOR_ITEM_STATEMENT] || Expression$1(Expression('item')),
                index: statements[FOR_ITEM_INDEX_STATEMENT] || Expression$1(Expression('index')),
            }, element);
        }
        return element;
    }

    function regenerateAttrs(attrNodes) {
        const attrs = [];
        const statements = {};
        const directives = {};

        for (let attr of attrNodes) {
            let {name, value = ''} = attr;
            if (value.type !== Types.Expression && isIncludeExpr(value)) {
                value = Expression$1(Expression(value));
            }

            if (name.startsWith(STATEMENT_MARK)) {
                Object.assign(statements, ({
                    [name]: value
                }));
            } else if (name.startsWith(DIRECTIVE_MARK)) {
                const directive = name.slice(1);
                Object.assign(directives, ({
                    [directive]: value
                }));
            } else {
                attrs.push(Object.assign({}, attr, {
                    value
                }));
            }
        }

        return {
            attrs, statements, directives
        };
    }

    function expr() {
        const expr = ll();
        next();
        return Expression$1(Expression(expr.content));
    }

    function attrs() {
        const attrs = [];
        while (la() === ATTR) {
            const name = ll().content;
            next();
            let value = consume(VALUE).content;

            if (!value) {
                value = Expression$1(Expression(consume(EXPR).content));
            }

            const attr = Attribute(name, value);
            attrs.push(attr);
        }
        return attrs;
    }

    function next() {
        pos ++;
    }

    function consume(type) {
        let matched = {};
        if (la() === type) {
            matched = ll();
            next();
        }
        return matched;
    }
}

class Element$1 {
    constructor(tag = '', props = [], context = {}, children = [], links = {}, key) {
        this.isElament = true;
        this.tag = tag;
        this.props = Array.isArray(props) ? getProppertyObject(props): props;
        this.context = context;
        this.children = children;
        this.links = links;
        this.key = key;
    }

    static create(...args) {
        return new Element$1(...args);
    }

    static clone(element) {
        const newElement = new Element$1();
        return Object.assign(newElement, element);
    }

    static isInstance(element) {
        return element && element.isElament;
    }
}

class Elements extends Array {
    constructor() {
        super();
        this.isElements = true;
    }

    static create() {
        return new Elements();
    }

    push(element) {
        if (
            element instanceof Element$1 || typeof element === 'string'
        ) {
            super.push(element);
        } else if (element instanceof Elements) {
            element.forEach(
                item => super.push(item)
            );
        }
        return this;
    }

    static isInstance(elements) {
        return elements && elements.isElements;
    }
}

// link element or Component as vElement
function link(node, element) {
    const {links} = element;
    const ondestroy = Object.keys(links).map(
        (name) =>  {
            const {link, binding} = links[name];
            return link(node, binding, element);
        }
    );

    element.ondestroy = () => {
        ondestroy.forEach(item => item());
    };

    element.ondestroy.id = uid();
}

class VComponent extends Element$1 {
    constructor(...args) {
        super(...args); 
    }

    setConstructor(constructor) {
        this.constructor = constructor;
        return this;
    }

    create() {
        const {constructor: Constructor, props, children, context} = this; 
    
        const component = new Constructor({
            state: props,
            body: children,
            context
        });

        link(component, this);
    
        this.ref = component;

        return component;
    }

    static create(...args) {
        return new VComponent(...args);
    }

    static isInstance(something) {
        return something instanceof VComponent;
    }
}

function createElements(elements, parent) {
    elements.forEach(
        element => appendElement(element, parent)
    );
    return parent;
}

function appendElement(element, parent) {
    if (VComponent.isInstance(element)) {
        element.create().mount(parent);
    } else {
        parent.appendChild(createElement(element, parent));
    }
}

function createElement(element) {
    const {props, tag, children} = element;
    let node;

    if (Element$1.isInstance(element)) {
        node = document.createElement(tag);

        createElements(children, node); // children
        link(node, element);         // links
        setProps(node, props);       // props
    } else if (element instanceof Elements) {
        const node = document.createDocumentFragment(); // package
        createElements(element, node);
    } else {
        node = document.createTextNode(element);
    }

    return node;
}

function setProps(node, props) {
    Object.keys(props).forEach((name) => {
        if (props[name] !== undefined) {
            node.setAttribute(name, props[name]);
        } else {
            node.removeAttribute(name);
        }
    });
}

function setStyle(node, styles) {
    Object.assign(node.style, styles);
}

const STATE = Symbol('state');
const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');
const EVENTS = Symbol('events');
const COMPUTED = 'computed';

const AST = Symbol('ast');
const VDOM = 'vDOM';  // Symbol('vDOM');
const RDOM = 'rDOM';  // Symbol('rDOM');
const EVENT = 'event'; //Symbol('event');

const BLOCK = 'block';

const TEXT$1 = 'text';
const STYLE = 'style';
const PROPS = 'props';
const REPLACE = 'replace';
const REMOVE = 'remove';
const NEW = 'new';


const MODIFY_BODY = 'modifyBody';

function walkDOM(tree, fn, index = -1) {
    tree.forEach(item => {
        fn(item, ++index);
        if (item.childNodes.length > 0) {
            index = walkDOM(item.childNodes, fn, index);
        }
    });
    return index;
}

function patch(dom, patches) {
    function patchElement(node, parent, nextElement) {
        return (currentPatch) => {
            const {type, changed, source} = currentPatch;
            let origin;

            if (Element$1.isInstance(changed)) {
                origin = changed.origin;
            } else if (typeof changed === 'string') {
                origin = changed;
            }

            switch (type) {

            case STYLE:
                setStyle(node.style, changed);
                break;

            case PROPS:
                setProps(node, changed);
                break;

            case TEXT$1:
                node[node.textContent ? 'textContent' : 'nodeValue'] = changed; // fuck ie
                break;

            case NEW:
                parent.insertBefore(createElement(origin), nextElement);
                // appendElement(origin, parent);
                break;

            case REPLACE:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                parent.replaceChild(createElement(origin), node);
                break;

            case REMOVE:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                parent.removeChild(node);
                break;
            default:
            }
        };
    }

    const list = [];

    walkDOM(dom, (node, index) => {
        list[index] = node;
    });

    // walk the difference set and update
    list.forEach((node, index) => {
        if (patches[index].length > 0) {
            patches[index].forEach(
                patchElement(node, node.parentNode, node.nextSibling)
            );
        }
    });

    list.length = 0; // gc
}

const id = uid();

var directives = {
    // eslint-disable-next-line
    '/on-.*/': (elem, binding, vnode) => {
        const {name, value} = binding;
        const doSomthing = ($event) => {
            return value({$event});
        };

        doSomthing.id = id();
        const event = name.slice(3);
        
        if (VComponent.isInstance(vnode)) {
            elem.on(event, doSomthing);
            return () => {
                elem.removeListener(event, doSomthing);
            };
        } else {
            elem.addEventListener(event, doSomthing);
            return () => {
                elem.removeEventListener(event, doSomthing); 
            };
        }
    },
    // eslint-disable-next-line
    ref(elem, binding, vnode) {
        const {value, context} = binding;
        
        context.refs[value()] = elem;
        return () => {
            context.refs[value] = null;
        };
    }
};

var events = {
    on(...args) {
        return this[EVENT].on(...args);
    },

    once(...args) {
        return this[EVENT].once(...args);
    },

    emit(...args) {
        return this[EVENT].emit(...args);
    },

    removeListener(...args) {
        return this[EVENT].removeListener(...args);
    },

    removeAllListeners(...args) {
        return this[EVENT].removeAllListeners(...args);
    }
};

function walkVDOM(lastT = [], nextT = [], fn, index = -1) {
    function hasChild(element) {
        return (Element$1.isInstance(element) && element.children.length > 0);
    }

    lastT.forEach((last, i) => {
        const next = nextT[i];
        fn(last, next, ++index);

        if (hasChild(last)) {
            const nextChildren = hasChild(next) ? next.children : [];
            index = walkVDOM(last.children, nextChildren, fn, index);
        }
    });

    if (nextT.length > lastT.length) {
        nextT.slice(lastT.length).forEach(
            (next) =>
                fn(void 0, next, index)
        );
    }

    return index;
}

function diff(lhs, rhs) {
    if (lhs === rhs) return {}; // equal return no diff

    if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

    const l = properObject(lhs);
    const r = properObject(rhs);

    const deletedValues = Object.keys(l).reduce((acc, key) => {
        return r.hasOwnProperty(key) ? acc : Object.assign({}, acc, {[key]: undefined });
    }, {});

    if (isDate(l) || isDate(r)) {
        if (l.valueOf() == r.valueOf()) return {};
        return r;
    }

    return Object.keys(r).reduce((acc, key) => {
        if (!l.hasOwnProperty(key)) return Object.assign({}, acc, {[key]: r[key] }); // return added r key

        const difference = diff(l[key], r[key]);

        if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff

        return Object.assign({}, acc, {[key]: difference }); // return updated key
    }, deletedValues);
}

function diffItem(last, next) {
    if (last === void 0) {
        return [{
            type: NEW,
            changed: next
        }];
    } 
    
    if (next === void 0) {
        return [{
            type: REMOVE,
            source: last
        }];
    }

    if (typeof last === typeof next) {
        if (typeof last === 'string') {
            if (last !== next) {
                return [{
                    type: TEXT$1,
                    changed: next
                }];
            }
            return [];
        }
    } else {
        return [{
            type: REPLACE,
            source: last,
            changed: next
        }];
    }

    const dif = [];

    // condition other changes (such as events eg.)
    if (last.tag !== next.tag) {
        return [{
            type: REPLACE,
            source: last,
            changed: next
        }];
    }

    const style = diff(last.props.style, next.props.style);
    if (!isEmpty(style)) {
        dif.push({
            type: STYLE,
            changed: style
        });
    }

    const props = diff(last.props, next.props);
    if (!isEmpty(props)) {
        dif.push({
            type: PROPS,
            changed: props
        });
    }

    if (VComponent.isInstance(last)) {
        const children = diff(last.children, next.children);
        if (!isEmpty(children)) {
            dif.push({
                type: MODIFY_BODY,
                changed: next.children
            });
        }
    }

    return dif;
}

function copyVElementState (from, to) {
    if (
        Element$1.isInstance(to)
        && Element$1.isInstance(from)
        && !to.ondestroy
    ) {
        to.ondestroy = from.ondestroy;
        
        if (VComponent.isInstance(from) && VComponent.isInstance(to)) {
            to.ref = from.ref;
        }
    }
}

function patchComponents(lastT, nextT) {
    walkVDOM(lastT, nextT, (last, next) => {
        copyVElementState(last, next);

        const isPatchedComponent = VComponent.isInstance(last) || VComponent.isInstance(next);
        if (isPatchedComponent) {
            const result = diffItem(last, next);
            result.forEach(
                item => 
                    patchComponent(Object.assign({}, item, {
                        source: last,
                        target: next
                    }))
            );

            const emptyarray = [];
            const vDOM = {
                last: emptyarray,
                next: emptyarray
            };

            if (last && last.ref) {
                vDOM.last = last.ref[VDOM];
            }

            if (next && next.ref) {
                next.ref[VDOM] = vDOM.next = next.ref.render(next.props);
            }

            patchComponents(vDOM.last, vDOM.next);
        }
    });
}



function patchComponent({
    type, source = {}, changed = {}, target
}) {
    const component = source.ref;
    const patch = [];
    switch (type) {
    case MODIFY_BODY:
        target.ref.body = changed;
        break;

    case PROPS:
        // component[STATE] = Object.assign(component.state, target.props);
        assignPrimitive(component[STATE], changed);
        break;

    case NEW:
        target.create();
        break;

    case REPLACE:
        if (VComponent.isInstance(source) && VComponent.isInstance(target)) {
            component.destroy();
            target.create();
        } else if (VComponent.isInstance(source) && !VComponent.isInstance(target)) {
            component.destroy();
        } else {
            target.create();
        }
        break;
        
    case REMOVE:
        component.destroy();
        break;
    default:
        target.ref = component;
    }

    return patch;
}

function getVTree(vTree) {
    let temp = [];

    vTree.forEach((item) => {
        if (VComponent.isInstance(item)) {
            if (item.ref) {
                temp = [
                    ...temp,
                    ...getVTree(item.ref[VDOM])
                ];
            } else {
                temp.push(item);
            }
        } else if (Element$1.isInstance(item)) {
            const copy = Element$1.clone(item);
            const children = getVTree(item.children);
            copy.children = children;
            copy.origin = item;
            temp.push(copy);
        } else { //  if (typeof item === 'string')
            temp.push(item);
        }
    });
    return temp;
}

function diffVDOM(lastT, nextT) { // 讲 virtual dom 的组件全部替换为 节点之后，再 diff
    const patches = {};
    const vLastT = getVTree(lastT);
    patchComponents(lastT, nextT);

    const vNextT = getVTree(nextT);

    walkVDOM(vLastT, vNextT, (last, next, i) => {
        const result = diffItem(last, next);

        if (!patches[i]) {
            patches[i] = [];
        }

        patches[i] = [
            ...patches[i], 
            ...result
        ];
    });

    return patches; // difference set
}

const expressionMap = new Map();
const compute = (computed) => {
    const computedResult = Object.keys(computed).reduce((result, item) => {
        return Object.assign(result, {
            [item]: typeof computed[item] === 'function'? computed[item](): computed[item]
        });
    }, {});
    return computedResult;
};

function evalExpression(expression, {state, methods, context, computed = {}}) {
    // cache expression
    if (!expressionMap.get(expression)) {
        const expr = codeGen(expression);
        const content = `
            with(context) {
                return ${expr};
            }
        `;
        expressionMap.set(expression, new Function('context', content));
    }

    const codeFn = expressionMap.get(expression);
    const scope = Object.assign({}, methods, state, compute(computed));
    return codeFn.call(context, scope);
}

function codeGen(expression) {
    const {type} = expression;
    switch (type) {
    case 'Expression':
        return codeGen(expression.value);

    case 'Identifier':
        return expression.name;

    case 'BinaryExpression':
    case 'LogicalExpression': {
        const left = codeGen(expression.left);
        const right = codeGen(expression.right);
        return `${left}${expression.operator}${right}`;
    }

    case 'MemberExpression': {
        const object = codeGen(expression.object);
        let property = codeGen(expression.property);
        property = (expression.computed) ? property: ('"'+property+'"');
        return `${object}[${property}]`;
    }

    case 'Compound': {
        // eslint-disable-next-line
        // debugger
        break;
    }

    case 'Literal':
        return expression.raw;

    case 'CallExpression': {
        const callee = codeGen(expression.callee);
        const args = expression.arguments.map(codeGen);
        return `${callee}(${args.join(',')})`;
    }

    case 'ThisExpression':
        return 'this';

    case 'UnaryExpression': {
        const operator = expression.operator;
        const argument = codeGen(expression.argument);
        return `${operator}(${argument})`;
    }

    case 'ConditionalExpression': {
        const test = codeGen(expression.test);
        const consequent = codeGen(expression.consequent);
        const alternate = codeGen(expression.alternate);
        return `(${test}?${consequent}:${alternate})`;
    }

    case 'ArrayExpression':
        return '[' + expression.elements.map(codeGen).join(',') + ']';

    default:
        warn('unexpected expression:');
        warn(JSON.stringify(expression));
    }
}

const {Program: Program$1, If: If$1, For: For$1, Element: ElementType, Expression: Expression$2, Text: Text$1, Attribute: Attribute$1, Include: Include$1} = Types;


function createVElement(node, viewContext) {
    const {state} = viewContext;
    switch (node.type) {
    case Text$1:
        return node.value;

    case Attribute$1: {
        const {value} = node;
        if (value.type === Expression$2) {
            const valueEvaluted = evalExpression(value, viewContext);
            if (valueEvaluted === false) {
                return null;
            }
            return Object.assign({}, node, {
                value: valueEvaluted
            });
        }
        return node;
    }

    case ElementType: {
        const {
            attributes, directives, children, name
        } = node;
        const {
            components, directives: thisDirectives, context
        } = viewContext;

        if (name.toLowerCase() === BLOCK) {
            return createVGroup(children, viewContext);
        }

        const attributeList = attributes.map((attribute) => createVElement(attribute, viewContext)).filter(item => item);


        let links = isEmpty(directives)
            ? {}
            : Object.keys(directives).reduce(
                (prev, pattern) => {
                    return Object.assign(prev, {
                        [pattern]: {
                            link: getDirective(pattern, thisDirectives),
                            binding: {
                                context,
                                name: pattern,
                                state,
                                value: (state = {}) => {
                                    const value = directives[pattern];
                                    if (value.type === Expression$2) {
                                        return evalExpression(value, 
                                            Object.assign(viewContext, {
                                                computed: Object.assign({}, viewContext.computed, state) // merge state into 
                                            }));
                                    }
                                    return value;
                                }
                            }
                        }
                    });
                },
                {}
            );

        if (Object.keys(components).includes(name)) {
            return new VComponent(
                name,
                attributeList,
                viewContext.context,
                createVGroup(children, viewContext),
                links
            ).setConstructor(components[name]);
        }

        return Element$1.create(
            name,
            attributeList,
            viewContext.context,
            createVGroup(children, viewContext),
            links
        );
    }

    case If$1: {
        let result;
        if (evalExpression(node.test, viewContext)) {
            result = createVElement(node.consequent, viewContext);
        } else if (node.alternate) {
            result = createVElement(node.alternate, viewContext);
        }
        return result;
    }

    case For$1: {
        const elements = Elements.create();
        const list = evalExpression(node.test, viewContext);
        const {item, index} = node.init;
        const itemName = item.type === Expression$2 ? codeGen(item): item;
        const indexName = index.type === Expression$2 ? codeGen(index): index;
        
        list.forEach(
            (item, index) => {
                elements.push(createVElement(node.body, Object.assign({},
                    viewContext, {
                        computed: {
                            [itemName]: () => evalExpression(node.test, viewContext)[index],
                            [indexName]: () => index
                        }
                    }
                )));
            }
        );

        return elements;
    }

    case Expression$2: {
        const result = evalExpression(node, viewContext);
        if (typeof result !== 'string') {
            return JSON.stringify(result, null, 4);
        }
        return result;
    }

    case Include$1: {
        const result = evalExpression(node.expression, viewContext);
        return result;
    }

    default:
    }
}

function createVGroup(nodes, viewContext) {
    const elements = Elements.create();

    nodes.forEach((node) => {
        elements.push(createVElement(node, viewContext));
    });

    return elements;
}

function createVDOM(ast, viewContext) {
    // create virtual dom
    const {type, body} = ast;
    if (type === Program$1) {
        return createVGroup(body, viewContext);
    } else {
        warn('Root element must be Program!');
    }
}

const inherit = Symbol('inherit');
// eslint-disable-next-line
const allInherits = (Daisy) => Daisy[inherit];

const inheritable = (Daisy) => {
    Daisy[inherit] = new Map();
};

function setInheritCache(context, cacheName) {
    if (!context[inherit].get(context)) {
        context[inherit].set(context, {});
    }
    const instantce = context[inherit].get(context);
    if (!instantce[cacheName]) {
        instantce[cacheName] = [];
    }
    const cache = instantce[cacheName];

    return (name, value) => {
        if (!value) {
            Object.keys(name).forEach((item) => {
                cache.push({
                    name: item,
                    value: name[item] 
                });
            });
            return;
        }

        cache.push({
            name, value
        });
    };
}

'use strict';

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var needDomainExit = false;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  if (needDomainExit)
    domain.exit();

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

class Daisy {
    render() {
        return '';
    }

    state() {
        return {};
    }

    constructor({
        state,
        body,
        context,
        render = this.render
    } = {}) {
        this.compose({state, body, context});

        const template = render();

        try {
            this[AST] = Parser(template);
        } catch (e) {
            throw new Error('Error in Parser: \n\t' + e.stack);
        }

        this.parsed(this[AST]);

        this.render = () => {
            const {
                [METHODS]: methods,
                [STATE]: state,
                [DIRECTIVES]: directives$$1,
                [COMPONENTS]: components,
                [COMPUTED]: computed,
                body
            } = this;

            return createVDOM(this[AST], {
                components, directives: directives$$1, state, methods, context: this, body, computed
            });
        };

        this[VDOM] = this.render();

        this[EVENTS].forEach(({name, handler}) => {
            this.on(name, handler.bind(this));
        });

        this.ready(this[VDOM]);
    }

    compose({
        state = {},
        body = [],
        context
    }) {
        this[STATE] = Object.assign({}, this.state(), state);
        this.body = body;
        this.context = context;
        this[EVENT] = new EventEmitter();

        this[METHODS] = {};
        this[DIRECTIVES] = [];
        this[COMPONENTS] = {};
        this[EVENTS] = [];
        this[COMPUTED] = [];
        this.refs = {};

        for (let [Componet, {
            [METHODS]: methods = [],
            [DIRECTIVES]: directives$$1 = [],
            [COMPONENTS]: components = [],
            [COMPUTED]: computed = [],
            [EVENTS]: events$$1 = []
        }] of allInherits(this.constructor)) {
            if (this instanceof Componet) {
                Object.assign(this[METHODS], getProppertyObject(methods));
                Object.assign(this[COMPONENTS], getProppertyObject(components));
                Object.assign(this[COMPUTED], getProppertyObject(computed));

                this[DIRECTIVES] = [
                    ...this[DIRECTIVES], ...directives$$1.map((item) => createDirective(item))
                ];

                this[EVENTS] = [
                    ...this[EVENTS], 
                    ...(events$$1.map(item => createEvent(item)))
                ];
            }
        }
    }

    getState() {
        return this[STATE];
    }

    destroy() {
        this.render = () => []; // render can create vDOM
        this.destroyed = true;
        this[STATE] = {};
        this.removeAllListeners();
    }

    mount(node) {
        createElements(this[VDOM], node, this);
        this[RDOM] = node.childNodes;
        this.mounted(this[RDOM]);  // vDOM, realDOM

        return this;
    }

    setState(state) {
        if (state === this[STATE]) {
            return false;
        }

        this[STATE] = Object.assign(this[STATE], state); // @todo clone state
        
        const dif = getRootElement(this).patchDiff();

        this.patched(dif);
    }

    patchDiff() {
        const {[VDOM]: lastVDOM} = this;

        this[VDOM] = this.render();

        const dif = diffVDOM(lastVDOM, this[VDOM]);

        patch(this[RDOM], dif);

        return dif;
    }
}

inheritable(Daisy);

Daisy.directive = setInheritCache(Daisy, DIRECTIVES);
Daisy.component = setInheritCache(Daisy, COMPONENTS);
Daisy.method = setInheritCache(Daisy, METHODS);
Daisy.event = setInheritCache(Daisy, EVENTS);
Daisy.computed = setInheritCache(Daisy, COMPUTED);

mixin(Daisy, events);

const hooks = {
    parsed: noop, ready: noop, mounted: noop, patched: noop
};

mixin(Daisy, hooks); // hook

Daisy.directive(directives);

Daisy.verison = '1.0.0';

Daisy.Lexer = Lexer;

Daisy.Parser = Parser;

return Daisy;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFpc3kuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGFyZWQvU3RhdGVUeXBlcy5qcyIsIi4uL3NyYy9zaGFyZWQvaGVscGVyLmpzIiwiLi4vbGliL2pzZXAuanMiLCIuLi9zcmMvY29yZS9wYXJzZXIvUGFyc2VFeHByZXNzaW9uLmpzIiwiLi4vc3JjL2NvcmUvcGFyc2VyL0xleGVyLmpzIiwiLi4vc3JjL3NoYXJlZC9Ob2RlVHlwZXMuanMiLCIuLi9zcmMvY29yZS9wYXJzZXIvUGFyc2VyLmpzIiwiLi4vc3JjL3NoYXJlZC9FbGVtZW50LmpzIiwiLi4vc3JjL3NoYXJlZC9FbGVtZW50cy5qcyIsIi4uL3NyYy9zaGFyZWQvbGluay5qcyIsIi4uL3NyYy9zaGFyZWQvVkNvbXBvbmVudC5qcyIsIi4uL3NyYy9icm93c2VyL3JlbmRlcmVycy9jcmVhdGVFbGVtZW50LmpzIiwiLi4vc3JjL3NoYXJlZC9jb25zdGFudC5qcyIsIi4uL3NyYy9icm93c2VyL3JlbmRlcmVycy9wYXRjaC5qcyIsIi4uL3NyYy9leHRlbnNpb25zL2RpcmVjdGl2ZXMuanMiLCIuLi9zcmMvZXh0ZW5zaW9ucy9ldmVudHMuanMiLCIuLi9zcmMvY29yZS92ZG9tL3dhbGsuanMiLCIuLi9zcmMvc2hhcmVkL2RpZmYuanMiLCIuLi9zcmMvY29yZS92ZG9tL2RpZmZJdGVtLmpzIiwiLi4vc3JjL2NvcmUvdmRvbS9wYXRjaENvbXBvbmVudHMuanMiLCIuLi9zcmMvc2hhcmVkL2dldFZUcmVlLmpzIiwiLi4vc3JjL2NvcmUvdmRvbS9kaWZmLmpzIiwiLi4vc3JjL2NvcmUvY29tcGlsZXIvZXZhbEV4cHJlc3Npb24uanMiLCIuLi9zcmMvY29yZS92ZG9tL2NyZWF0ZS5qcyIsIi4uL3NyYy9jb3JlL2luaGVyaXQuanMiLCIuLi9ub2RlX21vZHVsZXMvX3JvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGluc0AyLjEuMkByb2xsdXAtcGx1Z2luLW5vZGUtYnVpbHRpbnMvc3JjL2VzNi9ldmVudHMuanMiLCIuLi9zcmMvYnJvd3Nlci9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgSU5JVCA9ICdJTklUJztcbmV4cG9ydCBjb25zdCBPUEVOX1RBRyA9ICdPUEVOX1RBRyc7XG5leHBvcnQgY29uc3QgT1BFTl9DT01NRU5UID0gJ09QRU5fQ09NTUVOVCc7XG5leHBvcnQgY29uc3QgQ09NTUVOVCA9ICdDT01NRU5UJztcbmV4cG9ydCBjb25zdCBDTE9TRV9UQUcgPSAnQ0xPU0VfVEFHJztcbmV4cG9ydCBjb25zdCBFTkRfVEFHID0gJ0VORF9UQUcnO1xuZXhwb3J0IGNvbnN0IFRBR05BTUUgPSAnVEFHTkFNRSc7XG5leHBvcnQgY29uc3QgVEFHID0gJ1RBRyc7XG5leHBvcnQgY29uc3QgRVhQUiA9ICdFWFBSJztcbmV4cG9ydCBjb25zdCBURVhUID0gJ1RFWFQnO1xuZXhwb3J0IGNvbnN0IEFUVFIgPSAnQVRUUic7XG5leHBvcnQgY29uc3QgRVFVQUwgPSAnRVFVQUwnO1xuZXhwb3J0IGNvbnN0IFZBTFVFID0gJ1ZBTFVFJztcbmV4cG9ydCBjb25zdCBFT0YgPSAnRU9GJzsiLCJpbXBvcnQge1RBR05BTUUsIEVORF9UQUd9IGZyb20gJy4vU3RhdGVUeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RhZ0Nsb3NlZCh0b2tlbnMpIHtcbiAgICBsZXQgc3RhY2sgPSBbXTtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUoIGkgPCB0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICBjb25zdCB7dHlwZSwgY29udGVudH0gPSB0b2tlbjtcbiAgICAgICAgY29uc3QgbmV4dFRva2VuID0gdG9rZW5zW2kgKyAxXTtcbiAgICAgICAgaWYgKHR5cGUgPT09IFRBR05BTUUpIHtcbiAgICAgICAgICAgIGlmICghaXNTZWxmQ2xvc2UodG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZvaWRUYWcoY29udGVudCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKG5leHRUb2tlbi50eXBlID09PSBFTkRfVEFHXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBuZXh0VG9rZW4uY29udGVudCA9PT0gY29udGVudFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBFTkRfVEFHKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFja1RvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHN0YWNrVG9wLmNvbnRlbnQgPT09IGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmV0dXJuVW5jbG9zZWRUYWdFcnJvcihzdGFja1RvcClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGkgKys7XG4gICAgfVxuXG4gICAgaWYgKHN0YWNrLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBjb25zdCBzdGFja1RvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJldHVyblVuY2xvc2VkVGFnRXJyb3Ioc3RhY2tUb3ApXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtjbG9zZWQ6IHRydWV9O1xufVxuXG5leHBvcnQgY29uc3Qgdm9pZFRhZ1R5cGVzID0gWydhcmVhJywgJ2Jhc2UnLCAnYnInLCAnY29sJywgJ2VtYmVkJywgJ2hyJywgJ2ltZycsICdpbnB1dCcsICdrZXlnZW4nLCAnbGluaycsICdtZW51aXRlbScsICdtZXRhJywgJ3BhcmFtJywgJ3NvdXJjZScsICd0cmFjaycsICd3YnInLCAnci1jb250ZW50J107XG5leHBvcnQgY29uc3QgaXNWb2lkVGFnID0gKHRhZykgPT4gdm9pZFRhZ1R5cGVzLmluY2x1ZGVzKHRhZyk7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGZDbG9zZSA9ICh7dHlwZSwgaXNTZWxmQ2xvc2V9KSA9PiB0eXBlID09PSBUQUdOQU1FICYmIGlzU2VsZkNsb3NlO1xuXG5leHBvcnQgY29uc3QgcmV0dXJuVW5jbG9zZWRUYWdFcnJvciA9ICh7XG4gICAgY29udGVudCwgbGluZSwgY29sdW1uXG59KSA9PlxuICAgIGBVbmNsb3NlZCBUQUcgJHtjb250ZW50fSA6IFxcbmxpbmUgLSAke2xpbmV9LCBjb2x1bW4gLSAke2NvbHVtbn1gO1xuXG4vLyBhLXpBLVpcbmV4cG9ydCBjb25zdCBpc1NwYWNlID0gKGxldHRlciA9ICcnKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IGxldHRlci5jaGFyQ29kZUF0KDApO1xuICAgIHJldHVybiBjb2RlID09PSAzMiB8fCBjb2RlID09PSAxMDtcbn07XG4vLyBBLVpcbmV4cG9ydCBjb25zdCBpc0xvd2VyQ2FzZSA9IChsZXR0ZXIgPSAnJykgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSBsZXR0ZXIuY2hhckNvZGVBdCgwKTtcbiAgICByZXR1cm4gY29kZSA+PSA5NyAmJiBjb2RlIDw9IDEyMjtcbn07XG4vLyBBLVpcbmV4cG9ydCBjb25zdCBpc1VwcGVyQ2FzZSA9IChsZXR0ZXIgPSAnJykgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSBsZXR0ZXIuY2hhckNvZGVBdCgwKTtcbiAgICByZXR1cm4gY29kZSA+PSA2NSAmJiBjb2RlIDw9IDkwO1xufTtcbi8vIGEtekEtWlxuZXhwb3J0IGNvbnN0IGlzV29yZCA9IChsZXR0ZXIgPSAnJykgPT4gaXNMb3dlckNhc2UobGV0dGVyKSB8fCBpc1VwcGVyQ2FzZShsZXR0ZXIpO1xuLy8gIDAtOVxuZXhwb3J0IGNvbnN0IGlzTnVtYmVyID0gKGxldHRlciA9ICcnKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IGxldHRlci5jaGFyQ29kZUF0KDApO1xuICAgIHJldHVybiBjb2RlID49IDQ4ICYmIGNvZGUgPD0gNTc7XG59O1xuLy8gX1xuZXhwb3J0IGNvbnN0IGlzVW5kZXJzY29yZSA9IChsZXR0ZXIgPSAnJykgPT4gOTUgPT09IGxldHRlci5jaGFyQ29kZUF0KDApO1xuLy8gJFxuZXhwb3J0IGNvbnN0IGlzRG9sbGFyID0gKGxldHRlciA9ICcnKSA9PiAzNiA9PT0gbGV0dGVyLmNoYXJDb2RlQXQoMCk7XG4vLyAhXG5leHBvcnQgY29uc3QgaXNFeGNsYW1hdGlvbk1hcmsgPSAobGV0dGVyID0gJycpID0+IDMzID09PSBsZXR0ZXIuY2hhckNvZGVBdCgwKTtcbi8vIDxcbmV4cG9ydCBjb25zdCBpc09wZW5UYWcgPSAobGV0dGVyID0gJycpID0+IDYwID09PSBsZXR0ZXIuY2hhckNvZGVBdCgwKTtcbi8vICFcbmV4cG9ydCBjb25zdCBpc0Rhc2ggPSAobGV0dGVyID0gJycpID0+IDQ1ID09PSBsZXR0ZXIuY2hhckNvZGVBdCgwKTtcbi8vICd8fFwiXG5leHBvcnQgY29uc3QgaXNRdW90ZSA9IChsZXR0ZXIgPSAnJykgPT4gWzM0LCAzOV0uaW5jbHVkZXMobGV0dGVyLmNoYXJDb2RlQXQoMCkpO1xuLy8gPVxuZXhwb3J0IGNvbnN0IGlzRXF1YWwgPSAobGV0dGVyID0gJycpID0+IDYxID09PSBsZXR0ZXIuY2hhckNvZGVBdCgwKTtcbi8vIC9cbmV4cG9ydCBjb25zdCBpc1NsYXNoID0gKGxldHRlciA9ICcnKSA9PiA0NyA9PT0gbGV0dGVyLmNoYXJDb2RlQXQoMCk7XG4vLyA+XG5leHBvcnQgY29uc3QgaXNDbG9zZVRhZyA9IChsZXR0ZXIgPSAnJykgPT4gNjIgPT09IGxldHRlci5jaGFyQ29kZUF0KDApO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBkZWJ1ZyA9IChtZXNzYWdlKSA9PiB7fSAvL2NvbnNvbGUubG9nKCdkZWJ1ZzonLCBtZXNzYWdlKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgY29uc3Qgd2FybiA9IChtZXNzYWdlKSA9PiBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBlcnJvciA9IChtZXNzYWdlKSA9PiBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuXG5leHBvcnQgY29uc3QgaXNFbXB0eSA9IG8gPT4gT2JqZWN0LmtleXMobykubGVuZ3RoID09PSAwO1xuZXhwb3J0IGNvbnN0IGlzT2JqZWN0ID0gbyA9PiBvICE9IG51bGwgJiYgdHlwZW9mIG8gPT09ICdvYmplY3QnO1xuZXhwb3J0IGNvbnN0IHByb3Blck9iamVjdCA9IG8gPT4gaXNPYmplY3QobykgJiYgIW8uaGFzT3duUHJvcGVydHkgPyBPYmplY3QuYXNzaWduKHt9LCBvKSA6IG87XG5leHBvcnQgY29uc3QgaXNEYXRlID0gZCA9PiBkIGluc3RhbmNlb2YgRGF0ZTtcblxuXG5leHBvcnQgY29uc3QgZ2V0RGlyZWN0aXZlID0gKHBhdHRlcm4sIGRpcmVjdGl2ZXMpID0+IHtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IGRpcmVjdGl2ZXMuZmlsdGVyKCh7dGVzdH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHRlc3QocGF0dGVybik7XG4gICAgfSk7XG5cbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgY2FubnQgZmluZCB0aGUgZGlyZWN0aXZlICR7cGF0dGVybn0hYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkWzBdLmhhbmRsZXI7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZURpcmVjdGl2ZSA9ICh7bmFtZSwgdmFsdWU6IGhhbmRsZXJ9KSA9PiB7XG4gICAgY29uc3QgaXNSZWdFeHBMaWtlID0gKGl0ZW0pID0+IGl0ZW0uc3RhcnRzV2l0aCgnLycpICYmIGl0ZW0uZW5kc1dpdGgoJy8nKTtcbiAgICBjb25zdCBjcmVhdGVSZWdFeHAgPSAoaXRlbSkgPT4gbmV3IFJlZ0V4cChpdGVtLnNsaWNlKDEsIGl0ZW0ubGVuZ3RoLTEpKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0OiBpc1JlZ0V4cExpa2UobmFtZSkgPyBcbiAgICAgICAgICAgIChwYXR0ZXJuKSA9PiBjcmVhdGVSZWdFeHAobmFtZSkudGVzdChwYXR0ZXJuKVxuICAgICAgICAgICAgOiAocGF0dGVybikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lID09PSBwYXR0ZXJuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlclxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXZlbnQgPSAoe25hbWUsIHZhbHVlOiBoYW5kbGVyfSkgPT4gKHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIGhhbmRsZXJcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0UHJvcHBlcnR5T2JqZWN0ID0gKGxpc3QpID0+IHtcbiAgICByZXR1cm4gbGlzdC5yZWR1Y2UoKHByZXYsIHtuYW1lLCB2YWx1ZX0pID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocHJldiwge1xuICAgICAgICAgICAgW25hbWVdOiB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9LCB7fSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Um9vdEVsZW1lbnQgPSAoZWxlbWVudCkgPT4ge1xuICAgIHdoaWxlIChlbGVtZW50LmNvbnRleHQpIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuY29udGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpO1xufVxuXG5cbmNvbnN0IGlzTnVsbCA9ICAodGFyZ2V0KSA9PiB0YXJnZXRbbmFtZV0gPT09IHZvaWQgMCB8fCB0YXJnZXRbbmFtZV0gPT09IG51bGw7XG5cbmV4cG9ydCBjb25zdCBhc3NpZ25QcmltaXRpdmUgPSAodGFyZ2V0LCBjaGFuZ2VkKSA9PiB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiBjaGFuZ2VkKSB7XG4gICAgICAgIGlmIChjaGFuZ2VkLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkW25hbWVdO1xuXG4gICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoY2hhbmdlZFZhbHVlKSB8fCBpc051bGwodGFyZ2V0W25hbWVdKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNoYW5nZWRWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXNzaWduUHJpbWl0aXZlKHRhcmdldFtuYW1lXSwgY2hhbmdlZFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IHVpZCA9ICgpID0+IHtcbiAgICBsZXQgaWQgPSAgLTE7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgcmV0dXJuICsraWQ7XG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBtaXhpbiA9IChrbGFzcywgaW1wbCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGtsYXNzLnByb3RvdHlwZSwgaW1wbCk7XG59O1xuXG5leHBvcnQgY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3QgY2xvbmUgPSAoanNvbikgPT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShqc29uKSk7IiwiLy8gICAgIEphdmFTY3JpcHQgRXhwcmVzc2lvbiBQYXJzZXIgKEpTRVApIDwlPSB2ZXJzaW9uICU+XG4vLyAgICAgSlNFUCBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuLy8gICAgIGh0dHA6Ly9qc2VwLmZyb20uc28vXG5cbi8qZ2xvYmFsIG1vZHVsZTogdHJ1ZSwgZXhwb3J0czogdHJ1ZSwgY29uc29sZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uIChyb290KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIE5vZGUgVHlwZXNcbiAgICAvLyAtLS0tLS0tLS0tXG5cbiAgICAvLyBUaGlzIGlzIHRoZSBmdWxsIHNldCBvZiB0eXBlcyB0aGF0IGFueSBKU0VQIG5vZGUgY2FuIGJlLlxuICAgIC8vIFN0b3JlIHRoZW0gaGVyZSB0byBzYXZlIHNwYWNlIHdoZW4gbWluaWZpZWRcbiAgICB2YXIgQ09NUE9VTkQgPSAnQ29tcG91bmQnLFxuICAgICAgICBJREVOVElGSUVSID0gJ0lkZW50aWZpZXInLFxuICAgICAgICBNRU1CRVJfRVhQID0gJ01lbWJlckV4cHJlc3Npb24nLFxuICAgICAgICBMSVRFUkFMID0gJ0xpdGVyYWwnLFxuICAgICAgICBUSElTX0VYUCA9ICdUaGlzRXhwcmVzc2lvbicsXG4gICAgICAgIENBTExfRVhQID0gJ0NhbGxFeHByZXNzaW9uJyxcbiAgICAgICAgVU5BUllfRVhQID0gJ1VuYXJ5RXhwcmVzc2lvbicsXG4gICAgICAgIEJJTkFSWV9FWFAgPSAnQmluYXJ5RXhwcmVzc2lvbicsXG4gICAgICAgIExPR0lDQUxfRVhQID0gJ0xvZ2ljYWxFeHByZXNzaW9uJyxcbiAgICAgICAgQ09ORElUSU9OQUxfRVhQID0gJ0NvbmRpdGlvbmFsRXhwcmVzc2lvbicsXG4gICAgICAgIEFSUkFZX0VYUCA9ICdBcnJheUV4cHJlc3Npb24nLFxuXG4gICAgICAgIFBFUklPRF9DT0RFID0gNDYsIC8vICcuJ1xuICAgICAgICBDT01NQV9DT0RFICA9IDQ0LCAvLyAnLCdcbiAgICAgICAgU1FVT1RFX0NPREUgPSAzOSwgLy8gc2luZ2xlIHF1b3RlXG4gICAgICAgIERRVU9URV9DT0RFID0gMzQsIC8vIGRvdWJsZSBxdW90ZXNcbiAgICAgICAgT1BBUkVOX0NPREUgPSA0MCwgLy8gKFxuICAgICAgICBDUEFSRU5fQ09ERSA9IDQxLCAvLyApXG4gICAgICAgIE9CUkFDS19DT0RFID0gOTEsIC8vIFtcbiAgICAgICAgQ0JSQUNLX0NPREUgPSA5MywgLy8gXVxuICAgICAgICBRVU1BUktfQ09ERSA9IDYzLCAvLyA/XG4gICAgICAgIFNFTUNPTF9DT0RFID0gNTksIC8vIDtcbiAgICAgICAgQ09MT05fQ09ERSAgPSA1OCwgLy8gOlxuXG4gICAgICAgIHRocm93RXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UgKyAnIGF0IGNoYXJhY3RlciAnICsgaW5kZXgpO1xuICAgICAgICAgICAgZXJyb3IuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIGVycm9yLmRlc2NyaXB0aW9uID0gbWVzc2FnZTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE9wZXJhdGlvbnNcbiAgICAgICAgLy8gLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIFNldCBgdGAgdG8gYHRydWVgIHRvIHNhdmUgc3BhY2UgKHdoZW4gbWluaWZpZWQsIG5vdCBnemlwcGVkKVxuICAgICAgICB0ID0gdHJ1ZSxcbiAgICAgICAgLy8gVXNlIGEgcXVpY2tseS1hY2Nlc3NpYmxlIG1hcCB0byBzdG9yZSBhbGwgb2YgdGhlIHVuYXJ5IG9wZXJhdG9yc1xuICAgICAgICAvLyBWYWx1ZXMgYXJlIHNldCB0byBgdHJ1ZWAgKGl0IHJlYWxseSBkb2Vzbid0IG1hdHRlcilcbiAgICAgICAgdW5hcnlfb3BzID0geyctJzogdCwgJyEnOiB0LCAnfic6IHQsICcrJzogdH0sXG4gICAgICAgIC8vIEFsc28gdXNlIGEgbWFwIGZvciB0aGUgYmluYXJ5IG9wZXJhdGlvbnMgYnV0IHNldCB0aGVpciB2YWx1ZXMgdG8gdGhlaXJcbiAgICAgICAgLy8gYmluYXJ5IHByZWNlZGVuY2UgZm9yIHF1aWNrIHJlZmVyZW5jZTpcbiAgICAgICAgLy8gc2VlIFtPcmRlciBvZiBvcGVyYXRpb25zXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL09yZGVyX29mX29wZXJhdGlvbnMjUHJvZ3JhbW1pbmdfbGFuZ3VhZ2UpXG4gICAgICAgIGJpbmFyeV9vcHMgPSB7XG4gICAgICAgICAgICAnfHwnOiAxLCAnJiYnOiAyLCAnfCc6IDMsICAnXic6IDQsICAnJic6IDUsXG4gICAgICAgICAgICAnPT0nOiA2LCAnIT0nOiA2LCAnPT09JzogNiwgJyE9PSc6IDYsXG4gICAgICAgICAgICAnPCc6IDcsICAnPic6IDcsICAnPD0nOiA3LCAgJz49JzogNyxcbiAgICAgICAgICAgICc8PCc6OCwgICc+Pic6IDgsICc+Pj4nOiA4LFxuICAgICAgICAgICAgJysnOiA5LCAnLSc6IDksXG4gICAgICAgICAgICAnKic6IDEwLCAnLyc6IDEwLCAnJSc6IDEwXG4gICAgICAgIH0sXG4gICAgICAgIC8vIEdldCByZXR1cm4gdGhlIGxvbmdlc3Qga2V5IGxlbmd0aCBvZiBhbnkgb2JqZWN0XG4gICAgICAgIGdldE1heEtleUxlbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgdmFyIG1heF9sZW4gPSAwLCBsZW47XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZigobGVuID0ga2V5Lmxlbmd0aCkgPiBtYXhfbGVuICYmIG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heF9sZW4gPSBsZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1heF9sZW47XG4gICAgICAgIH0sXG4gICAgICAgIG1heF91bm9wX2xlbiA9IGdldE1heEtleUxlbih1bmFyeV9vcHMpLFxuICAgICAgICBtYXhfYmlub3BfbGVuID0gZ2V0TWF4S2V5TGVuKGJpbmFyeV9vcHMpLFxuICAgICAgICAvLyBMaXRlcmFsc1xuICAgICAgICAvLyAtLS0tLS0tLS0tXG4gICAgICAgIC8vIFN0b3JlIHRoZSB2YWx1ZXMgdG8gcmV0dXJuIGZvciB0aGUgdmFyaW91cyBsaXRlcmFscyB3ZSBtYXkgZW5jb3VudGVyXG4gICAgICAgIGxpdGVyYWxzID0ge1xuICAgICAgICAgICAgJ3RydWUnOiB0cnVlLFxuICAgICAgICAgICAgJ2ZhbHNlJzogZmFsc2UsXG4gICAgICAgICAgICAnbnVsbCc6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gRXhjZXB0IGZvciBgdGhpc2AsIHdoaWNoIGlzIHNwZWNpYWwuIFRoaXMgY291bGQgYmUgY2hhbmdlZCB0byBzb21ldGhpbmcgbGlrZSBgJ3NlbGYnYCBhcyB3ZWxsXG4gICAgICAgIHRoaXNfc3RyID0gJ3RoaXMnLFxuICAgICAgICAvLyBSZXR1cm5zIHRoZSBwcmVjZWRlbmNlIG9mIGEgYmluYXJ5IG9wZXJhdG9yIG9yIGAwYCBpZiBpdCBpc24ndCBhIGJpbmFyeSBvcGVyYXRvclxuICAgICAgICBiaW5hcnlQcmVjZWRlbmNlID0gZnVuY3Rpb24ob3BfdmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluYXJ5X29wc1tvcF92YWxdIHx8IDA7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIFV0aWxpdHkgZnVuY3Rpb24gKGdldHMgY2FsbGVkIGZyb20gbXVsdGlwbGUgcGxhY2VzKVxuICAgICAgICAvLyBBbHNvIG5vdGUgdGhhdCBgYSAmJiBiYCBhbmQgYGEgfHwgYmAgYXJlICpsb2dpY2FsKiBleHByZXNzaW9ucywgbm90IGJpbmFyeSBleHByZXNzaW9uc1xuICAgICAgICBjcmVhdGVCaW5hcnlFeHByZXNzaW9uID0gZnVuY3Rpb24gKG9wZXJhdG9yLCBsZWZ0LCByaWdodCkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSAob3BlcmF0b3IgPT09ICd8fCcgfHwgb3BlcmF0b3IgPT09ICcmJicpID8gTE9HSUNBTF9FWFAgOiBCSU5BUllfRVhQO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiByaWdodFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gYGNoYCBpcyBhIGNoYXJhY3RlciBjb2RlIGluIHRoZSBuZXh0IHRocmVlIGZ1bmN0aW9uc1xuICAgICAgICBpc0RlY2ltYWxEaWdpdCA9IGZ1bmN0aW9uKGNoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGNoID49IDQ4ICYmIGNoIDw9IDU3KTsgLy8gMC4uLjlcbiAgICAgICAgfSxcbiAgICAgICAgaXNJZGVudGlmaWVyU3RhcnQgPSBmdW5jdGlvbihjaCkge1xuICAgICAgICAgICAgcmV0dXJuIChjaCA9PT0gMzYpIHx8IChjaCA9PT0gOTUpIHx8IC8vIGAkYCBhbmQgYF9gXG4gICAgIChjaCA+PSA2NSAmJiBjaCA8PSA5MCkgfHwgLy8gQS4uLlpcbiAgICAgKGNoID49IDk3ICYmIGNoIDw9IDEyMikgfHwgLy8gYS4uLnpcbiAgICAgICAgICAgICAgICAgICAgKGNoID49IDEyOCAmJiAhYmluYXJ5X29wc1tTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKV0pOyAvLyBhbnkgbm9uLUFTQ0lJIHRoYXQgaXMgbm90IGFuIG9wZXJhdG9yXG4gICAgICAgIH0sXG4gICAgICAgIGlzSWRlbnRpZmllclBhcnQgPSBmdW5jdGlvbihjaCkge1xuICAgICAgICAgICAgcmV0dXJuIChjaCA9PT0gMzYpIHx8IChjaCA9PT0gOTUpIHx8IC8vIGAkYCBhbmQgYF9gXG4gICAgIChjaCA+PSA2NSAmJiBjaCA8PSA5MCkgfHwgLy8gQS4uLlpcbiAgICAgKGNoID49IDk3ICYmIGNoIDw9IDEyMikgfHwgLy8gYS4uLnpcbiAgICAgKGNoID49IDQ4ICYmIGNoIDw9IDU3KSB8fCAvLyAwLi4uOVxuICAgICAgICAgICAgICAgICAgICAoY2ggPj0gMTI4ICYmICFiaW5hcnlfb3BzW1N0cmluZy5mcm9tQ2hhckNvZGUoY2gpXSk7IC8vIGFueSBub24tQVNDSUkgdGhhdCBpcyBub3QgYW4gb3BlcmF0b3JcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBQYXJzaW5nXG4gICAgICAgIC8vIC0tLS0tLS1cbiAgICAgICAgLy8gYGV4cHJgIGlzIGEgc3RyaW5nIHdpdGggdGhlIHBhc3NlZCBpbiBleHByZXNzaW9uXG4gICAgICAgIGpzZXAgPSBmdW5jdGlvbihleHByKSB7XG4gICAgICAgICAgICAvLyBgaW5kZXhgIHN0b3JlcyB0aGUgY2hhcmFjdGVyIG51bWJlciB3ZSBhcmUgY3VycmVudGx5IGF0IHdoaWxlIGBsZW5ndGhgIGlzIGEgY29uc3RhbnRcbiAgICAgICAgICAgIC8vIEFsbCBvZiB0aGUgZ29iYmxlcyBiZWxvdyB3aWxsIG1vZGlmeSBgaW5kZXhgIGFzIHdlIG1vdmUgYWxvbmdcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDAsXG4gICAgICAgICAgICAgICAgY2hhckF0RnVuYyA9IGV4cHIuY2hhckF0LFxuICAgICAgICAgICAgICAgIGNoYXJDb2RlQXRGdW5jID0gZXhwci5jaGFyQ29kZUF0LFxuICAgICAgICAgICAgICAgIGV4cHJJID0gZnVuY3Rpb24oaSkgeyByZXR1cm4gY2hhckF0RnVuYy5jYWxsKGV4cHIsIGkpOyB9LFxuICAgICAgICAgICAgICAgIGV4cHJJQ29kZSA9IGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGNoYXJDb2RlQXRGdW5jLmNhbGwoZXhwciwgaSk7IH0sXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gZXhwci5sZW5ndGgsXG5cbiAgICAgICAgICAgICAgICAvLyBQdXNoIGBpbmRleGAgdXAgdG8gdGhlIG5leHQgbm9uLXNwYWNlIGNoYXJhY3RlclxuICAgICAgICAgICAgICAgIGdvYmJsZVNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2ggPSBleHBySUNvZGUoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBzcGFjZSBvciB0YWJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoY2ggPT09IDMyIHx8IGNoID09PSA5IHx8IGNoID09PSAxMCB8fCBjaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gZXhwcklDb2RlKCsraW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIFRoZSBtYWluIHBhcnNpbmcgZnVuY3Rpb24uIE11Y2ggb2YgdGhpcyBjb2RlIGlzIGRlZGljYXRlZCB0byB0ZXJuYXJ5IGV4cHJlc3Npb25zXG4gICAgICAgICAgICAgICAgZ29iYmxlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IGdvYmJsZUJpbmFyeUV4cHJlc3Npb24oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNlcXVlbnQsIGFsdGVybmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgZ29iYmxlU3BhY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV4cHJJQ29kZShpbmRleCkgPT09IFFVTUFSS19DT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXJuYXJ5IGV4cHJlc3Npb246IHRlc3QgPyBjb25zZXF1ZW50IDogYWx0ZXJuYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc2VxdWVudCA9IGdvYmJsZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjb25zZXF1ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignRXhwZWN0ZWQgZXhwcmVzc2lvbicsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdvYmJsZVNwYWNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXhwcklDb2RlKGluZGV4KSA9PT0gQ09MT05fQ09ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0ZXJuYXRlID0gZ29iYmxlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFhbHRlcm5hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignRXhwZWN0ZWQgZXhwcmVzc2lvbicsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQ09ORElUSU9OQUxfRVhQLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0OiB0ZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zZXF1ZW50OiBjb25zZXF1ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoJ0V4cGVjdGVkIDonLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvLyBTZWFyY2ggZm9yIHRoZSBvcGVyYXRpb24gcG9ydGlvbiBvZiB0aGUgc3RyaW5nIChlLmcuIGArYCwgYD09PWApXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgYnkgdGFraW5nIHRoZSBsb25nZXN0IHBvc3NpYmxlIGJpbmFyeSBvcGVyYXRpb25zICgzIGNoYXJhY3RlcnM6IGA9PT1gLCBgIT09YCwgYD4+PmApXG4gICAgICAgICAgICAgICAgLy8gYW5kIG1vdmUgZG93biBmcm9tIDMgdG8gMiB0byAxIGNoYXJhY3RlciB1bnRpbCBhIG1hdGNoaW5nIGJpbmFyeSBvcGVyYXRpb24gaXMgZm91bmRcbiAgICAgICAgICAgICAgICAvLyB0aGVuLCByZXR1cm4gdGhhdCBiaW5hcnkgb3BlcmF0aW9uXG4gICAgICAgICAgICAgICAgZ29iYmxlQmluYXJ5T3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29iYmxlU3BhY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiaW9wLCB0b19jaGVjayA9IGV4cHIuc3Vic3RyKGluZGV4LCBtYXhfYmlub3BfbGVuKSwgdGNfbGVuID0gdG9fY2hlY2subGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSh0Y19sZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihiaW5hcnlfb3BzLmhhc093blByb3BlcnR5KHRvX2NoZWNrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IHRjX2xlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9fY2hlY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b19jaGVjayA9IHRvX2NoZWNrLnN1YnN0cigwLCAtLXRjX2xlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHJlc3BvbnNpYmxlIGZvciBnb2JibGluZyBhbiBpbmRpdmlkdWFsIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgLy8gZS5nLiBgMWAsIGAxKzJgLCBgYSsoYioyKS1NYXRoLnNxcnQoMilgXG4gICAgICAgICAgICAgICAgZ29iYmxlQmluYXJ5RXhwcmVzc2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hfaSwgbm9kZSwgYmlvcCwgcHJlYywgc3RhY2ssIGJpb3BfaW5mbywgbGVmdCwgcmlnaHQsIGk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3QsIHRyeSB0byBnZXQgdGhlIGxlZnRtb3N0IHRoaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZW4sIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSdzIGEgYmluYXJ5IG9wZXJhdG9yIG9wZXJhdGluZyBvbiB0aGF0IGxlZnRtb3N0IHRoaW5nXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBnb2JibGVUb2tlbigpO1xuICAgICAgICAgICAgICAgICAgICBiaW9wID0gZ29iYmxlQmluYXJ5T3AoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXNuJ3QgYSBiaW5hcnkgb3BlcmF0b3IsIGp1c3QgcmV0dXJuIHRoZSBsZWZ0bW9zdCBub2RlXG4gICAgICAgICAgICAgICAgICAgIGlmKCFiaW9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgbmVlZCB0byBzdGFydCBhIHN0YWNrIHRvIHByb3Blcmx5IHBsYWNlIHRoZSBiaW5hcnkgb3BlcmF0aW9ucyBpbiB0aGVpclxuICAgICAgICAgICAgICAgICAgICAvLyBwcmVjZWRlbmNlIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgICAgICBiaW9wX2luZm8gPSB7IHZhbHVlOiBiaW9wLCBwcmVjOiBiaW5hcnlQcmVjZWRlbmNlKGJpb3ApfTtcblxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IGdvYmJsZVRva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFyaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignRXhwZWN0ZWQgZXhwcmVzc2lvbiBhZnRlciAnICsgYmlvcCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrID0gW2xlZnQsIGJpb3BfaW5mbywgcmlnaHRdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFByb3Blcmx5IGRlYWwgd2l0aCBwcmVjZWRlbmNlIHVzaW5nIFtyZWN1cnNpdmUgZGVzY2VudF0oaHR0cDovL3d3dy5lbmdyLm11bi5jYS9+dGhlby9NaXNjL2V4cF9wYXJzaW5nLmh0bSlcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoKGJpb3AgPSBnb2JibGVCaW5hcnlPcCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlYyA9IGJpbmFyeVByZWNlZGVuY2UoYmlvcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHByZWMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJpb3BfaW5mbyA9IHsgdmFsdWU6IGJpb3AsIHByZWM6IHByZWMgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVkdWNlOiBtYWtlIGEgYmluYXJ5IGV4cHJlc3Npb24gZnJvbSB0aGUgdGhyZWUgdG9wbW9zdCBlbnRyaWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChzdGFjay5sZW5ndGggPiAyKSAmJiAocHJlYyA8PSBzdGFja1tzdGFjay5sZW5ndGggLSAyXS5wcmVjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmlvcCA9IHN0YWNrLnBvcCgpLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gY3JlYXRlQmluYXJ5RXhwcmVzc2lvbihiaW9wLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IGdvYmJsZVRva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoJ0V4cGVjdGVkIGV4cHJlc3Npb24gYWZ0ZXIgJyArIGJpb3AsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYmlvcF9pbmZvLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGkgPSBzdGFjay5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICBub2RlID0gc3RhY2tbaV07XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKGkgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gY3JlYXRlQmluYXJ5RXhwcmVzc2lvbihzdGFja1tpIC0gMV0udmFsdWUsIHN0YWNrW2kgLSAyXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpIC09IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIEFuIGluZGl2aWR1YWwgcGFydCBvZiBhIGJpbmFyeSBleHByZXNzaW9uOlxuICAgICAgICAgICAgICAgIC8vIGUuZy4gYGZvby5iYXIoYmF6KWAsIGAxYCwgYFwiYWJjXCJgLCBgKGEgJSAyKWAgKGJlY2F1c2UgaXQncyBpbiBwYXJlbnRoZXNpcylcbiAgICAgICAgICAgICAgICBnb2JibGVUb2tlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2gsIHRvX2NoZWNrLCB0Y19sZW47XG5cbiAgICAgICAgICAgICAgICAgICAgZ29iYmxlU3BhY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoID0gZXhwcklDb2RlKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBpZihpc0RlY2ltYWxEaWdpdChjaCkgfHwgY2ggPT09IFBFUklPRF9DT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFyIGNvZGUgNDYgaXMgYSBkb3QgYC5gIHdoaWNoIGNhbiBzdGFydCBvZmYgYSBudW1lcmljIGxpdGVyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnb2JibGVOdW1lcmljTGl0ZXJhbCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY2ggPT09IFNRVU9URV9DT0RFIHx8IGNoID09PSBEUVVPVEVfQ09ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIG9yIGRvdWJsZSBxdW90ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnb2JibGVTdHJpbmdMaXRlcmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IE9CUkFDS19DT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ29iYmxlQXJyYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvX2NoZWNrID0gZXhwci5zdWJzdHIoaW5kZXgsIG1heF91bm9wX2xlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0Y19sZW4gPSB0b19jaGVjay5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSh0Y19sZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodW5hcnlfb3BzLmhhc093blByb3BlcnR5KHRvX2NoZWNrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArPSB0Y19sZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBVTkFSWV9FWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogdG9fY2hlY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudDogZ29iYmxlVG9rZW4oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b19jaGVjayA9IHRvX2NoZWNrLnN1YnN0cigwLCAtLXRjX2xlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChjaCkgfHwgY2ggPT09IE9QQVJFTl9DT0RFKSB7IC8vIG9wZW4gcGFyZW50aGVzaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBgZm9vYCwgYGJhci5iYXpgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdvYmJsZVZhcmlhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyBQYXJzZSBzaW1wbGUgbnVtZXJpYyBsaXRlcmFsczogYDEyYCwgYDMuNGAsIGAuNWAuIERvIHRoaXMgYnkgdXNpbmcgYSBzdHJpbmcgdG9cbiAgICAgICAgICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIGV2ZXJ5dGhpbmcgaW4gdGhlIG51bWVyaWMgbGl0ZXJhbCBhbmQgdGhlbiBjYWxsaW5nIGBwYXJzZUZsb2F0YCBvbiB0aGF0IHN0cmluZ1xuICAgICAgICAgICAgICAgIGdvYmJsZU51bWVyaWNMaXRlcmFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXIgPSAnJywgY2gsIGNoQ29kZTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoaXNEZWNpbWFsRGlnaXQoZXhwcklDb2RlKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlciArPSBleHBySShpbmRleCsrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGV4cHJJQ29kZShpbmRleCkgPT09IFBFUklPRF9DT0RFKSB7IC8vIGNhbiBzdGFydCB3aXRoIGEgZGVjaW1hbCBtYXJrZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlciArPSBleHBySShpbmRleCsrKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUoaXNEZWNpbWFsRGlnaXQoZXhwcklDb2RlKGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXIgKz0gZXhwckkoaW5kZXgrKyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjaCA9IGV4cHJJKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2ggPT09ICdlJyB8fCBjaCA9PT0gJ0UnKSB7IC8vIGV4cG9uZW50IG1hcmtlclxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyICs9IGV4cHJJKGluZGV4KyspO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBleHBySShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaCA9PT0gJysnIHx8IGNoID09PSAnLScpIHsgLy8gZXhwb25lbnQgc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlciArPSBleHBySShpbmRleCsrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKGlzRGVjaW1hbERpZ2l0KGV4cHJJQ29kZShpbmRleCkpKSB7IC8vZXhwb25lbnQgaXRzZWxmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyICs9IGV4cHJJKGluZGV4KyspO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzRGVjaW1hbERpZ2l0KGV4cHJJQ29kZShpbmRleC0xKSkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignRXhwZWN0ZWQgZXhwb25lbnQgKCcgKyBudW1iZXIgKyBleHBySShpbmRleCkgKyAnKScsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgY2hDb2RlID0gZXhwcklDb2RlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoaXMgaXNuJ3QgYSB2YXJpYWJsZSBuYW1lIHRoYXQgc3RhcnQgd2l0aCBhIG51bWJlciAoMTIzYWJjKVxuICAgICAgICAgICAgICAgICAgICBpZihpc0lkZW50aWZpZXJTdGFydChjaENvZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKCdWYXJpYWJsZSBuYW1lcyBjYW5ub3Qgc3RhcnQgd2l0aCBhIG51bWJlciAoJyArXG4gICAgICAgICBudW1iZXIgKyBleHBySShpbmRleCkgKyAnKScsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNoQ29kZSA9PT0gUEVSSU9EX0NPREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoJ1VuZXhwZWN0ZWQgcGVyaW9kJywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IExJVEVSQUwsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcGFyc2VGbG9hdChudW1iZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmF3OiBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8gUGFyc2VzIGEgc3RyaW5nIGxpdGVyYWwsIHN0YXJpbmcgd2l0aCBzaW5nbGUgb3IgZG91YmxlIHF1b3RlcyB3aXRoIGJhc2ljIHN1cHBvcnQgZm9yIGVzY2FwZSBjb2Rlc1xuICAgICAgICAgICAgICAgIC8vIGUuZy4gYFwiaGVsbG8gd29ybGRcImAsIGAndGhpcyBpc1xcbkpTRVAnYFxuICAgICAgICAgICAgICAgIGdvYmJsZVN0cmluZ0xpdGVyYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ciA9ICcnLCBxdW90ZSA9IGV4cHJJKGluZGV4KyspLCBjbG9zZWQgPSBmYWxzZSwgY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gZXhwckkoaW5kZXgrKyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaCA9PT0gcXVvdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNoID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgYWxsIG9mIHRoZSBjb21tb24gZXNjYXBlIGNvZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBleHBySShpbmRleCsrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICduJzogc3RyICs9ICdcXG4nOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyJzogc3RyICs9ICdcXHInOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0Jzogc3RyICs9ICdcXHQnOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzogc3RyICs9ICdcXGInOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzogc3RyICs9ICdcXGYnOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd2Jzogc3RyICs9ICdcXHgwQic7IGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQgOiBzdHIgKz0gY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZighY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKCdVbmNsb3NlZCBxdW90ZSBhZnRlciBcIicrc3RyKydcIicsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBMSVRFUkFMLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHN0cixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdzogcXVvdGUgKyBzdHIgKyBxdW90ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvLyBHb2JibGVzIG9ubHkgaWRlbnRpZmllcnNcbiAgICAgICAgICAgICAgICAvLyBlLmcuOiBgZm9vYCwgYF92YWx1ZWAsIGAkeDFgXG4gICAgICAgICAgICAgICAgLy8gQWxzbywgdGhpcyBmdW5jdGlvbiBjaGVja3MgaWYgdGhhdCBpZGVudGlmaWVyIGlzIGEgbGl0ZXJhbDpcbiAgICAgICAgICAgICAgICAvLyAoZS5nLiBgdHJ1ZWAsIGBmYWxzZWAsIGBudWxsYCkgb3IgYHRoaXNgXG4gICAgICAgICAgICAgICAgZ29iYmxlSWRlbnRpZmllciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2ggPSBleHBySUNvZGUoaW5kZXgpLCBzdGFydCA9IGluZGV4LCBpZGVudGlmaWVyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzSWRlbnRpZmllclN0YXJ0KGNoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoJ1VuZXhwZWN0ZWQgJyArIGV4cHJJKGluZGV4KSwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gZXhwcklDb2RlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzSWRlbnRpZmllclBhcnQoY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllciA9IGV4cHIuc2xpY2Uoc3RhcnQsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsaXRlcmFscy5oYXNPd25Qcm9wZXJ0eShpZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBMSVRFUkFMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBsaXRlcmFsc1tpZGVudGlmaWVyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXc6IGlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpZGVudGlmaWVyID09PSB0aGlzX3N0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogVEhJU19FWFAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogSURFTlRJRklFUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIEdvYmJsZXMgYSBsaXN0IG9mIGFyZ3VtZW50cyB3aXRoaW4gdGhlIGNvbnRleHQgb2YgYSBmdW5jdGlvbiBjYWxsXG4gICAgICAgICAgICAgICAgLy8gb3IgYXJyYXkgbGl0ZXJhbC4gVGhpcyBmdW5jdGlvbiBhbHNvIGFzc3VtZXMgdGhhdCB0aGUgb3BlbmluZyBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICAvLyBgKGAgb3IgYFtgIGhhcyBhbHJlYWR5IGJlZW4gZ29iYmxlZCwgYW5kIGdvYmJsZXMgZXhwcmVzc2lvbnMgYW5kIGNvbW1hc1xuICAgICAgICAgICAgICAgIC8vIHVudGlsIHRoZSB0ZXJtaW5hdG9yIGNoYXJhY3RlciBgKWAgb3IgYF1gIGlzIGVuY291bnRlcmVkLlxuICAgICAgICAgICAgICAgIC8vIGUuZy4gYGZvbyhiYXIsIGJheilgLCBgbXlfZnVuYygpYCwgb3IgYFtiYXIsIGJhel1gXG4gICAgICAgICAgICAgICAgZ29iYmxlQXJndW1lbnRzID0gZnVuY3Rpb24odGVybWluYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoX2ksIGFyZ3MgPSBbXSwgbm9kZSwgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb2JibGVTcGFjZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoX2kgPSBleHBySUNvZGUoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2hfaSA9PT0gdGVybWluYXRpb24pIHsgLy8gZG9uZSBwYXJzaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaF9pID09PSBDT01NQV9DT0RFKSB7IC8vIGJldHdlZW4gZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gZ29iYmxlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFub2RlIHx8IG5vZGUudHlwZSA9PT0gQ09NUE9VTkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignRXhwZWN0ZWQgY29tbWEnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignRXhwZWN0ZWQgJyArIFN0cmluZy5mcm9tQ2hhckNvZGUodGVybWluYXRpb24pLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIEdvYmJsZSBhIG5vbi1saXRlcmFsIHZhcmlhYmxlIG5hbWUuIFRoaXMgdmFyaWFibGUgbmFtZSBtYXkgaW5jbHVkZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgLy8gZS5nLiBgZm9vYCwgYGJhci5iYXpgLCBgZm9vWydiYXInXS5iYXpgXG4gICAgICAgICAgICAgICAgLy8gSXQgYWxzbyBnb2JibGVzIGZ1bmN0aW9uIGNhbGxzOlxuICAgICAgICAgICAgICAgIC8vIGUuZy4gYE1hdGguYWNvcyhvYmouYW5nbGUpYFxuICAgICAgICAgICAgICAgIGdvYmJsZVZhcmlhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaF9pLCBub2RlO1xuICAgICAgICAgICAgICAgICAgICBjaF9pID0gZXhwcklDb2RlKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBpZihjaF9pID09PSBPUEFSRU5fQ09ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IGdvYmJsZUdyb3VwKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gZ29iYmxlSWRlbnRpZmllcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdvYmJsZVNwYWNlcygpO1xuICAgICAgICAgICAgICAgICAgICBjaF9pID0gZXhwcklDb2RlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoY2hfaSA9PT0gUEVSSU9EX0NPREUgfHwgY2hfaSA9PT0gT0JSQUNLX0NPREUgfHwgY2hfaSA9PT0gT1BBUkVOX0NPREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaF9pID09PSBQRVJJT0RfQ09ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvYmJsZVNwYWNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IE1FTUJFUl9FWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBub2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZ29iYmxlSWRlbnRpZmllcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjaF9pID09PSBPQlJBQ0tfQ09ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IE1FTUJFUl9FWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBnb2JibGVFeHByZXNzaW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvYmJsZVNwYWNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoX2kgPSBleHBySUNvZGUoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNoX2kgIT09IENCUkFDS19DT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoJ1VuY2xvc2VkIFsnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY2hfaSA9PT0gT1BBUkVOX0NPREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBIGZ1bmN0aW9uIGNhbGwgaXMgYmVpbmcgbWFkZTsgZ29iYmxlIGFsbCB0aGUgYXJndW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQ0FMTF9FWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhcmd1bWVudHMnOiBnb2JibGVBcmd1bWVudHMoQ1BBUkVOX0NPREUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZWU6IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ29iYmxlU3BhY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaF9pID0gZXhwcklDb2RlKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8gUmVzcG9uc2libGUgZm9yIHBhcnNpbmcgYSBncm91cCBvZiB0aGluZ3Mgd2l0aGluIHBhcmVudGhlc2VzIGAoKWBcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBpdCBuZWVkcyB0byBnb2JibGUgdGhlIG9wZW5pbmcgcGFyZW50aGVzaXNcbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhlbiB0cmllcyB0byBnb2JibGUgZXZlcnl0aGluZyB3aXRoaW4gdGhhdCBwYXJlbnRoZXNpcywgYXNzdW1pbmdcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHRoZSBuZXh0IHRoaW5nIGl0IHNob3VsZCBzZWUgaXMgdGhlIGNsb3NlIHBhcmVudGhlc2lzLiBJZiBub3QsXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB0aGUgZXhwcmVzc2lvbiBwcm9iYWJseSBkb2Vzbid0IGhhdmUgYSBgKWBcbiAgICAgICAgICAgICAgICBnb2JibGVHcm91cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGdvYmJsZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZ29iYmxlU3BhY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV4cHJJQ29kZShpbmRleCkgPT09IENQQVJFTl9DT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKCdVbmNsb3NlZCAoJywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIFJlc3BvbnNpYmxlIGZvciBwYXJzaW5nIEFycmF5IGxpdGVyYWxzIGBbMSwgMiwgM11gXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgaXQgbmVlZHMgdG8gZ29iYmxlIHRoZSBvcGVuaW5nIGJyYWNrZXRcbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhlbiB0cmllcyB0byBnb2JibGUgdGhlIGV4cHJlc3Npb25zIGFzIGFyZ3VtZW50cy5cbiAgICAgICAgICAgICAgICBnb2JibGVBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQVJSQVlfRVhQLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHM6IGdvYmJsZUFyZ3VtZW50cyhDQlJBQ0tfQ09ERSlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbXSwgY2hfaSwgbm9kZTtcblxuICAgICAgICAgICAgd2hpbGUoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaF9pID0gZXhwcklDb2RlKGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8vIEV4cHJlc3Npb25zIGNhbiBiZSBzZXBhcmF0ZWQgYnkgc2VtaWNvbG9ucywgY29tbWFzLCBvciBqdXN0IGluZmVycmVkIHdpdGhvdXQgYW55XG4gICAgICAgICAgICAgICAgLy8gc2VwYXJhdG9yc1xuICAgICAgICAgICAgICAgIGlmKGNoX2kgPT09IFNFTUNPTF9DT0RFIHx8IGNoX2kgPT09IENPTU1BX0NPREUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKzsgLy8gaWdub3JlIHNlcGFyYXRvcnNcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdG8gZ29iYmxlIGVhY2ggZXhwcmVzc2lvbiBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgICAgICAgICAgaWYoKG5vZGUgPSBnb2JibGVFeHByZXNzaW9uKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2Ugd2VyZW4ndCBhYmxlIHRvIGZpbmQgYSBiaW5hcnkgZXhwcmVzc2lvbiBhbmQgYXJlIG91dCBvZiByb29tLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZXhwcmVzc2lvbiBwYXNzZWQgaW4gcHJvYmFibHkgaGFzIHRvbyBtdWNoXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcignVW5leHBlY3RlZCBcIicgKyBleHBySShpbmRleCkgKyAnXCInLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgb25seSBvbmUgZXhwcmVzc2lvbiBqdXN0IHRyeSByZXR1cm5pbmcgdGhlIGV4cHJlc3Npb25cbiAgICAgICAgICAgIGlmKG5vZGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2Rlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQ09NUE9VTkQsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IG5vZGVzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIC8vIFRvIGJlIGZpbGxlZCBpbiBieSB0aGUgdGVtcGxhdGVcbiAgICBqc2VwLnZlcnNpb24gPSAnPCU9IHZlcnNpb24gJT4nO1xuICAgIGpzZXAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuICdKYXZhU2NyaXB0IEV4cHJlc3Npb24gUGFyc2VyIChKU0VQKSB2JyArIGpzZXAudmVyc2lvbjsgfTtcblxuICAgIC8qKlxuXHQgKiBAbWV0aG9kIGpzZXAuYWRkVW5hcnlPcFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3BfbmFtZSBUaGUgbmFtZSBvZiB0aGUgdW5hcnkgb3AgdG8gYWRkXG5cdCAqIEByZXR1cm4ganNlcFxuXHQgKi9cbiAgICBqc2VwLmFkZFVuYXJ5T3AgPSBmdW5jdGlvbihvcF9uYW1lKSB7XG4gICAgICAgIG1heF91bm9wX2xlbiA9IE1hdGgubWF4KG9wX25hbWUubGVuZ3RoLCBtYXhfdW5vcF9sZW4pO1xuICAgICAgICB1bmFyeV9vcHNbb3BfbmFtZV0gPSB0OyByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG5cdCAqIEBtZXRob2QganNlcC5hZGRCaW5hcnlPcFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3BfbmFtZSBUaGUgbmFtZSBvZiB0aGUgYmluYXJ5IG9wIHRvIGFkZFxuXHQgKiBAcGFyYW0ge251bWJlcn0gcHJlY2VkZW5jZSBUaGUgcHJlY2VkZW5jZSBvZiB0aGUgYmluYXJ5IG9wIChjYW4gYmUgYSBmbG9hdClcblx0ICogQHJldHVybiBqc2VwXG5cdCAqL1xuICAgIGpzZXAuYWRkQmluYXJ5T3AgPSBmdW5jdGlvbihvcF9uYW1lLCBwcmVjZWRlbmNlKSB7XG4gICAgICAgIG1heF9iaW5vcF9sZW4gPSBNYXRoLm1heChvcF9uYW1lLmxlbmd0aCwgbWF4X2Jpbm9wX2xlbik7XG4gICAgICAgIGJpbmFyeV9vcHNbb3BfbmFtZV0gPSBwcmVjZWRlbmNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG5cdCAqIEBtZXRob2QganNlcC5hZGRMaXRlcmFsXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBsaXRlcmFsX25hbWUgVGhlIG5hbWUgb2YgdGhlIGxpdGVyYWwgdG8gYWRkXG5cdCAqIEBwYXJhbSB7Kn0gbGl0ZXJhbF92YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGxpdGVyYWxcblx0ICogQHJldHVybiBqc2VwXG5cdCAqL1xuICAgIGpzZXAuYWRkTGl0ZXJhbCA9IGZ1bmN0aW9uKGxpdGVyYWxfbmFtZSwgbGl0ZXJhbF92YWx1ZSkge1xuICAgICAgICBsaXRlcmFsc1tsaXRlcmFsX25hbWVdID0gbGl0ZXJhbF92YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuXHQgKiBAbWV0aG9kIGpzZXAucmVtb3ZlVW5hcnlPcFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3BfbmFtZSBUaGUgbmFtZSBvZiB0aGUgdW5hcnkgb3AgdG8gcmVtb3ZlXG5cdCAqIEByZXR1cm4ganNlcFxuXHQgKi9cbiAgICBqc2VwLnJlbW92ZVVuYXJ5T3AgPSBmdW5jdGlvbihvcF9uYW1lKSB7XG4gICAgICAgIGRlbGV0ZSB1bmFyeV9vcHNbb3BfbmFtZV07XG4gICAgICAgIGlmKG9wX25hbWUubGVuZ3RoID09PSBtYXhfdW5vcF9sZW4pIHtcbiAgICAgICAgICAgIG1heF91bm9wX2xlbiA9IGdldE1heEtleUxlbih1bmFyeV9vcHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcblx0ICogQG1ldGhvZCBqc2VwLnJlbW92ZUFsbFVuYXJ5T3BzXG5cdCAqIEByZXR1cm4ganNlcFxuXHQgKi9cbiAgICBqc2VwLnJlbW92ZUFsbFVuYXJ5T3BzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVuYXJ5X29wcyA9IHt9O1xuICAgICAgICBtYXhfdW5vcF9sZW4gPSAwO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcblx0ICogQG1ldGhvZCBqc2VwLnJlbW92ZUJpbmFyeU9wXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcF9uYW1lIFRoZSBuYW1lIG9mIHRoZSBiaW5hcnkgb3AgdG8gcmVtb3ZlXG5cdCAqIEByZXR1cm4ganNlcFxuXHQgKi9cbiAgICBqc2VwLnJlbW92ZUJpbmFyeU9wID0gZnVuY3Rpb24ob3BfbmFtZSkge1xuICAgICAgICBkZWxldGUgYmluYXJ5X29wc1tvcF9uYW1lXTtcbiAgICAgICAgaWYob3BfbmFtZS5sZW5ndGggPT09IG1heF9iaW5vcF9sZW4pIHtcbiAgICAgICAgICAgIG1heF9iaW5vcF9sZW4gPSBnZXRNYXhLZXlMZW4oYmluYXJ5X29wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuXHQgKiBAbWV0aG9kIGpzZXAucmVtb3ZlQWxsQmluYXJ5T3BzXG5cdCAqIEByZXR1cm4ganNlcFxuXHQgKi9cbiAgICBqc2VwLnJlbW92ZUFsbEJpbmFyeU9wcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBiaW5hcnlfb3BzID0ge307XG4gICAgICAgIG1heF9iaW5vcF9sZW4gPSAwO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcblx0ICogQG1ldGhvZCBqc2VwLnJlbW92ZUxpdGVyYWxcblx0ICogQHBhcmFtIHtzdHJpbmd9IGxpdGVyYWxfbmFtZSBUaGUgbmFtZSBvZiB0aGUgbGl0ZXJhbCB0byByZW1vdmVcblx0ICogQHJldHVybiBqc2VwXG5cdCAqL1xuICAgIGpzZXAucmVtb3ZlTGl0ZXJhbCA9IGZ1bmN0aW9uKGxpdGVyYWxfbmFtZSkge1xuICAgICAgICBkZWxldGUgbGl0ZXJhbHNbbGl0ZXJhbF9uYW1lXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuXHQgKiBAbWV0aG9kIGpzZXAucmVtb3ZlQWxsTGl0ZXJhbHNcblx0ICogQHJldHVybiBqc2VwXG5cdCAqL1xuICAgIGpzZXAucmVtb3ZlQWxsTGl0ZXJhbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGl0ZXJhbHMgPSB7fTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gSW4gZGVza3RvcCBlbnZpcm9ubWVudHMsIGhhdmUgYSB3YXkgdG8gcmVzdG9yZSB0aGUgb2xkIHZhbHVlIGZvciBganNlcGBcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBvbGRfanNlcCA9IHJvb3QuanNlcDtcbiAgICAgICAgLy8gVGhlIHN0YXIgb2YgdGhlIHNob3chIEl0J3MgYSBmdW5jdGlvbiFcbiAgICAgICAgcm9vdC5qc2VwID0ganNlcDtcbiAgICAgICAgLy8gQW5kIGEgY291cnRlb3VzIGZ1bmN0aW9uIHdpbGxpbmcgdG8gbW92ZSBvdXQgb2YgdGhlIHdheSBmb3Igb3RoZXIgc2ltaWxhcmx5LW5hbWVkIG9iamVjdHMhXG4gICAgICAgIGpzZXAubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYocm9vdC5qc2VwID09PSBqc2VwKSB7XG4gICAgICAgICAgICAgICAgcm9vdC5qc2VwID0gb2xkX2pzZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ganNlcDtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbiBOb2RlLkpTIGVudmlyb25tZW50c1xuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGpzZXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRzLnBhcnNlID0ganNlcDtcbiAgICAgICAgfVxuICAgIH1cbn0odGhpcykpO1xuIiwiaW1wb3J0IHBhcnNlIGZyb20gJy4uLy4uLy4uL2xpYi9qc2VwJztcblxubGV0IEVYUFJfT1BFTl9CT1VORFMgPSAne3snO1xubGV0IEVYUFJfQ0xPU0VfQk9VTkRTID0gJ319JztcblxuZnVuY3Rpb24gUGFyc2VFeHByZXNzaW9uKHNvdXJjZSkge1xuICAgIHJldHVybiBwYXJzZShzb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBpc1N0YXJ0c1dpdGhFeHByT3BlbkJvdW5kcyhzb3VyY2UsIHBvcykge1xuICAgIHJldHVybiBzb3VyY2Uuc3RhcnRzV2l0aChFWFBSX09QRU5fQk9VTkRTLCBwb3MpO1xufVxuXG5mdW5jdGlvbiBzcGxpdEV4cHJlc3Npb25Db250ZW50KHNvdXJjZSwgc3RhcnRzUG9zKSB7XG4gICAgY29uc3QgZXhwckNsb3NlQm91bmRzSW5kZXggPSBzb3VyY2UuaW5kZXhPZihFWFBSX0NMT1NFX0JPVU5EUywgc3RhcnRzUG9zKTtcbiAgICBjb25zdCBjb250ZW50ID0gJygnICsgc291cmNlLnN1YnN0cmluZyhzdGFydHNQb3MgKyBFWFBSX09QRU5fQk9VTkRTLmxlbmd0aCwgZXhwckNsb3NlQm91bmRzSW5kZXgpICsgJyknO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgcG9zOiBleHByQ2xvc2VCb3VuZHNJbmRleCArIEVYUFJfQ0xPU0VfQk9VTkRTLmxlbmd0aFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHNwbGl0U3RyaW5nQ29udGVudChzb3VyY2UsIHN0YXJ0c1Bvcykge1xuICAgIGxldCBzdHJpbmdFbmRJbmRleCA9IHNvdXJjZS5pbmRleE9mKEVYUFJfT1BFTl9CT1VORFMsIHN0YXJ0c1Bvcyk7XG4gICAgaWYgKCF+c3RyaW5nRW5kSW5kZXgpIHtcbiAgICAgICAgc3RyaW5nRW5kSW5kZXggPSBzb3VyY2UubGVuZ3RoO1xuICAgIH1cbiAgICBsZXQgY29udGVudCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnRzUG9zLCBzdHJpbmdFbmRJbmRleCk7XG4gICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgY29udGVudCA9ICdcIicgKyBjb250ZW50ICsgJ1wiJztcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgcG9zOiBzdHJpbmdFbmRJbmRleFxuICAgIH07XG59XG5cbi8vIHtcbmV4cG9ydCBmdW5jdGlvbiBpc09wZW5FeHByKGxldHRlciA9ICcnLCBuZXh0TGV0dGVyID0gJycpIHtcbiAgICByZXR1cm4gW2xldHRlciwgbmV4dExldHRlcl0uam9pbignJykuaW5kZXhPZihFWFBSX09QRU5fQk9VTkRTKSA9PT0gMDtcbn1cblxuLy8gfVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xvc2VFeHByKGxldHRlciA9ICcnLCBuZXh0TGV0dGVyID0gJycpIHtcbiAgICByZXR1cm4gW2xldHRlciwgbmV4dExldHRlcl0uam9pbignJykuaW5kZXhPZihFWFBSX0NMT1NFX0JPVU5EUykgPT09IDA7XG59XG5cbi8vIGluY2x1ZGVzIHt7IH19XG5leHBvcnQgZnVuY3Rpb24gaXNJbmNsdWRlRXhwcih3b3JkcyA9ICcnKSB7XG4gICAgcmV0dXJuIHdvcmRzLmluY2x1ZGVzKEVYUFJfT1BFTl9CT1VORFMpICYmIHdvcmRzLmluY2x1ZGVzKEVYUFJfQ0xPU0VfQk9VTkRTKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4cHJlc3Npb25Cb3VuZHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb3BlbjogRVhQUl9PUEVOX0JPVU5EUyxcbiAgICAgICAgY2xvc2U6IEVYUFJfQ0xPU0VfQk9VTkRTXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEV4cHJlc3Npb25Cb3VuZHMoe1xuICAgIG9wZW4sXG4gICAgY2xvc2Vcbn0pIHtcbiAgICBFWFBSX09QRU5fQk9VTkRTID0gb3BlbjtcbiAgICBFWFBSX0NMT1NFX0JPVU5EUyA9IGNsb3NlO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBFeHByZXNzaW9uKHNvdXJjZSA9ICcnKSB7XG4gICAgaWYgKGlzSW5jbHVkZUV4cHIoc291cmNlKSkge1xuICAgICAgICBsZXQgc3RhY2sgPSBbXTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgICAgIHBvc1xuICAgICAgICAgICAgfSA9IGlzU3RhcnRzV2l0aEV4cHJPcGVuQm91bmRzKHNvdXJjZSwgaSkgPyBzcGxpdEV4cHJlc3Npb25Db250ZW50KHNvdXJjZSwgaSkgOiBzcGxpdFN0cmluZ0NvbnRlbnQoc291cmNlLCBpKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50KVxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goY29udGVudCk7XG4gICAgICAgICAgICBpID0gcG9zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQYXJzZUV4cHJlc3Npb24oc3RhY2suam9pbignKycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUGFyc2VFeHByZXNzaW9uKHNvdXJjZSk7XG4gICAgfVxufSIsImltcG9ydCB7Q09NTUVOVCwgRU5EX1RBRywgVEFHTkFNRSwgQ0xPU0VfVEFHLCBFWFBSLCBURVhULCBBVFRSLCBWQUxVRSwgRU9GfSBmcm9tICcuLi8uLi9zaGFyZWQvU3RhdGVUeXBlcyc7XG5pbXBvcnQge2lzU2xhc2gsIGlzU3BhY2UsIGlzT3BlblRhZywgaXNFeGNsYW1hdGlvbk1hcmssIGlzRGFzaCwgaXNDbG9zZVRhZywgaXNFcXVhbCwgaXNRdW90ZSwgaXNUYWdDbG9zZWR9IGZyb20gJy4uLy4uL3NoYXJlZC9oZWxwZXInO1xuaW1wb3J0IHtpc09wZW5FeHByLCBpc0Nsb3NlRXhwciwgZ2V0RXhwcmVzc2lvbkJvdW5kc30gZnJvbSAnLi9QYXJzZUV4cHJlc3Npb24nO1xuXG5mdW5jdGlvbiBjcmVhdGVUb2tlbih0b2tlblR5cGUsIHRlbXAgPSBbXSkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0ZW1wLmpvaW4oJycpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHRva2VuVHlwZSxcbiAgICAgICAgY29udGVudFxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExleGVyKHNvdXJjZSkge1xuICAgIGxldCBwb3MgPSAwO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcbiAgICBjb25zdCB7b3BlbjogRVhQUl9PUEVOX0JPVU5EUywgY2xvc2U6IEVYUFJfQ0xPU0VfQk9VTkRTfSA9IGdldEV4cHJlc3Npb25Cb3VuZHMoKTtcblxuXG4gICAgZnVuY3Rpb24gY29uc3VtZVNwYWNlcyhwb3MpIHtcbiAgICAgICAgd2hpbGUgKGlzU3BhY2Uoc291cmNlW3Bvc10pKSB7cG9zKys7fVxuICAgICAgICByZXR1cm4ge3Bvc307XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc3VtZUNsb3NlVGFnKHBvcykge1xuICAgICAgICBsZXQgbGV0dGVyID0gc291cmNlW3Bvc107XG4gICAgICAgIGxldCBuZXh0ID0gc291cmNlW3BvcyArIDFdO1xuICAgICAgICBpZiAoaXNTbGFzaChsZXR0ZXIpICYmIGlzQ2xvc2VUYWcobmV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcG9zOiBwb3MgKyAyLFxuICAgICAgICAgICAgICAgIGlzU2VsZkNsb3NlOiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGlzQ2xvc2VUYWcobGV0dGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3M6IHBvcyArIDEsXG4gICAgICAgICAgICAgICAgaXNTZWxmQ2xvc2U6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc3VtZVZhbHVlKHBvcykge1xuICAgICAgICBsZXQgbGV0dGVyID0gc291cmNlW3Bvc107XG4gICAgICAgIGxldCB0ZW1wID0gW107XG5cbiAgICAgICAgaWYgKGlzUXVvdGUobGV0dGVyKSkge1xuICAgICAgICAgICAgdGVtcC5wdXNoKGxldHRlcik7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzUXVvdGUobGV0dGVyKSAmJiBsZXR0ZXIgPT09IHRlbXBbMF0gJiYgc291cmNlW3BvcyAtIDFdICE9PSAnXFxcXCdcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGxldHRlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3M6IHBvcyArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogY3JlYXRlVG9rZW4oVkFMVUUsIHRlbXAuc2xpY2UoMSwgdGVtcC5sZW5ndGgtMSkpIC8vIHJlbW92ZSBeXCIgXCIkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGxldHRlcik7XG4gICAgICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgICAgICAgICBsZXQgY2xvc2VUYWdSZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3BhY2UobGV0dGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvczogcG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGNyZWF0ZVRva2VuKFZBTFVFLCB0ZW1wKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNsb3NlVGFnUmVzdWx0ID0gY29uc3VtZUNsb3NlVGFnKHBvcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBjcmVhdGVUb2tlbihWQUxVRSwgdGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvczogcG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBjbG9zZVRhZ1Jlc3VsdC5pc1NlbGZDbG9zZSA/IHNldFRva2VuU2VsZkNsb3NlKHRva2VuKTogdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2gobGV0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc3VtZUF0dHJzKHBvcykge1xuICAgICAgICBsZXQgbGV0dGVyID0gc291cmNlW3Bvc107XG4gICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgIGNvbnN0IGdyb3VwID0gW107XG5cbiAgICAgICAgd2hpbGUgKHBvcyA8IGxlbmd0aCkge1xuICAgICAgICAgICAgbGV0dGVyID0gc291cmNlW3Bvc107XG4gICAgICAgICAgICBpZiAoaXNFcXVhbChsZXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKGNyZWF0ZVRva2VuKEFUVFIsIHRlbXApKTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwb3MgKys7XG4gICAgICAgICAgICAgICAgcG9zID0gY29uc3VtZVNwYWNlcyhwb3MpLnBvcztcblxuICAgICAgICAgICAgICAgIGNvbnN0IHtwb3M6IHBvc05leHQsIHRva2VufSA9IChjb25zdW1lRXhwcmVzc2lvbihwb3MpIHx8IGNvbnN1bWVWYWx1ZShwb3MpKSB8fCB7fTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zTmV4dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgY29uc3VtZUNsb3NlVGFnKHBvcylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmICh0ZW1wLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAucHVzaChjcmVhdGVUb2tlbihBVFRSLCB0ZW1wKSk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBncm91cFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzU3BhY2UobGV0dGVyKSkge1xuICAgICAgICAgICAgICAgIHBvcyA9IGNvbnN1bWVTcGFjZXMocG9zKS5wb3M7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBncm91cC5wdXNoKGNyZWF0ZVRva2VuKEFUVFIsIHRlbXApKTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKGxldHRlcik7XG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25zdW1lVGFnKHBvcykge1xuICAgICAgICBsZXQgbGV0dGVyID0gc291cmNlW3Bvc107XG4gICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgIGxldCBncm91cCA9IFtdO1xuXG4gICAgICAgIGlmIChpc09wZW5UYWcobGV0dGVyKVxuICAgICAgICAmJiAhaXNTbGFzaChzb3VyY2VbcG9zICsgMV0pXG4gICAgICAgICYmICFpc1NwYWNlKHNvdXJjZVtwb3MgKyAxXSlcbiAgICAgICAgJiYgIWlzT3BlblRhZyhzb3VyY2VbcG9zICsgMV0pXG4gICAgICAgICYmICFpc0Nsb3NlVGFnKHNvdXJjZVtwb3MgKyAxXSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICArK3BvcztcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7cG9zOiBwb3NDbG9zZVRhZywgaXNTZWxmQ2xvc2V9ID0gY29uc3VtZUNsb3NlVGFnKHBvcykgfHwge307XG5cbiAgICAgICAgICAgICAgICBpZiAocG9zQ2xvc2VUYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVG9rZW4oVEFHTkFNRSwgdGVtcClcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTZWxmQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwWzBdID0gc2V0VG9rZW5TZWxmQ2xvc2UoZ3JvdXBbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAucHVzaChjcmVhdGVUb2tlbihDTE9TRV9UQUcpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zOiBwb3NDbG9zZVRhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBncm91cFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpc1NwYWNlKGxldHRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gY29uc3VtZVNwYWNlcyhwb3MpLnBvcztcblxuICAgICAgICAgICAgICAgICAgICBncm91cCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRva2VuKFRBR05BTUUsIHRlbXApXG4gICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHt0b2tlbjogYXR0cnMsIHBvczogcG9zQXR0cnN9ID0gY29uc3VtZUF0dHJzKHBvcykgfHwge307XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5ncm91cCwgLi4uYXR0cnNcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3NBdHRycztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGNvbnN1bWVTcGFjZXMocG9zKS5wb3M7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGxldHRlcik7XG4gICAgICAgICAgICAgICAgICAgICsrcG9zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN1bWVFbmRUYWcocG9zKSB7XG4gICAgICAgIGxldCBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgbGV0IHRlbXAgPSBbXTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBpc09wZW5UYWcobGV0dGVyKSAmJiBpc1NsYXNoKHNvdXJjZVtwb3MgKyAxXSkgJiZcbiAgICAgICAgKFxuICAgICAgICAgICAgIWlzU3BhY2Uoc291cmNlW3BvcyArIDJdKSAmJlxuICAgICAgICAgICFpc09wZW5UYWcoc291cmNlW3BvcyArIDJdKVxuICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgcG9zICs9IDI7XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgICBpZiAoaXNTcGFjZShsZXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGNvbnN1bWVTcGFjZXMocG9zKS5wb3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQ2xvc2VUYWcobGV0dGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IGNyZWF0ZVRva2VuKEVORF9UQUcsIHRlbXApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zOiBwb3MgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGxldHRlcik7XG4gICAgICAgICAgICAgICAgICAgIHBvcyArKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25zdW1lQ29tbWVudChwb3MpIHtcbiAgICAgICAgbGV0IGxldHRlciA9IHNvdXJjZVtwb3NdO1xuICAgICAgICBsZXQgdGVtcCA9IFtdO1xuXG4gICAgICAgIGlmIChpc09wZW5UYWcobGV0dGVyKVxuICAgICAgICAgICYmIGlzRXhjbGFtYXRpb25NYXJrKHNvdXJjZVsrK3Bvc10pXG4gICAgICAgICAgJiYgaXNEYXNoKHNvdXJjZVsrK3Bvc10pXG4gICAgICAgICAgJiYgaXNEYXNoKHNvdXJjZVsrK3Bvc10pKSB7XG4gICAgICAgICAgICArK3BvcztcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNEYXNoKGxldHRlcikgJiYgaXNEYXNoKHNvdXJjZVtwb3MgKyAxXSkgJiYgaXNDbG9zZVRhZyhzb3VyY2VbcG9zICsgMl0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3M6IHBvcyArIDMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogY3JlYXRlVG9rZW4oQ09NTUVOVCwgdGVtcClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2gobGV0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zICsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3MsXG4gICAgICAgICAgICAgICAgdG9rZW46IGNyZWF0ZVRva2VuKENPTU1FTlQsIHRlbXApXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc3VtZVRleHQocG9zKSB7XG4gICAgICAgIGxldCBsZXR0ZXIgPSBzb3VyY2VbcG9zXTtcbiAgICAgICAgbGV0IHRlbXAgPSBbXTtcblxuICAgICAgICB0ZW1wLnB1c2gobGV0dGVyKTtcbiAgICAgICAgcG9zKys7XG4gICAgICAgIHdoaWxlIChwb3MgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGxldHRlciA9IHNvdXJjZVtwb3NdO1xuICAgICAgICAgICAgaWYgKGlzT3BlblRhZyhsZXR0ZXIpIHx8IGlzT3BlbkV4cHIobGV0dGVyLCBzb3VyY2VbcG9zICsgMV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBjcmVhdGVUb2tlbihURVhULCB0ZW1wKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXAucHVzaChsZXR0ZXIpO1xuICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICAgIHRva2VuOiBjcmVhdGVUb2tlbihURVhULCB0ZW1wKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN1bWVFeHByZXNzaW9uKHBvcykge1xuICAgICAgICBsZXQgbGV0dGVyID0gc291cmNlW3Bvc107XG4gICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgIGlmIChpc09wZW5FeHByKGxldHRlciwgc291cmNlW3BvcyArIDFdKSkge1xuICAgICAgICAgICAgcG9zICs9IEVYUFJfT1BFTl9CT1VORFMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKHBvcyA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxldHRlciA9IHNvdXJjZVtwb3NdO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuRXhwcihsZXR0ZXIsIHNvdXJjZVtwb3MgKyAxXSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VFeHByKGxldHRlciwgc291cmNlW3BvcyArIDFdKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBwb3MgKz0gRVhQUl9DTE9TRV9CT1VORFMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogY3JlYXRlVG9rZW4oRVhQUiwgdGVtcClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2gobGV0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VG9rZW5TZWxmQ2xvc2UodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24odG9rZW4sIHtcbiAgICAgICAgICAgIGlzU2VsZkNsb3NlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbWVyZ2VUZXh0VG9rZW5zKCkge1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gdG9rZW5zLnJlZHVjZSgobGlzdCwgdG9rZW4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZUb2tlbiA9IGxpc3RbaW5kZXggLSAxXTtcblxuICAgICAgICAgICAgaWYgKCh0b2tlbi50eXBlID09PSBURVhUKSAmJiBwcmV2VG9rZW4gJiYgKHByZXZUb2tlbi50eXBlID09PSBURVhUKSkge1xuICAgICAgICAgICAgICAgIHByZXZUb2tlbi5jb250ZW50ICs9IHRva2VuLmNvbnRlbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICB3aGlsZSAocG9zIDwgbGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGxldHRlciA9IHNvdXJjZVtwb3NdO1xuICAgIC8qIGVzbGludC1lbmFibGUgKi9cbiAgICAgICAgY29uc3QgcmVmcyA9IGNvbnN1bWVFbmRUYWcocG9zKSB8fCBjb25zdW1lQ29tbWVudChwb3MpIHx8IGNvbnN1bWVUYWcocG9zKSB8fCBjb25zdW1lRXhwcmVzc2lvbihwb3MpIHx8IGNvbnN1bWVUZXh0KHBvcyk7XG5cbiAgICAgICAgaWYgKCFyZWZzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGF2YWxpYWJsZSB0b2tlbjpcXG4nICsgc291cmNlLnN1YnN0cihwb3MpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHtwb3M6IHBvc05leHQsIHRva2VufSA9IHJlZnM7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3NOZXh0O1xuICAgICAgICAgICAgICAgIHRva2VucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgLi4udG9rZW5zLCAuLi50b2tlblxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3NOZXh0O1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRva2VucyA9IG1lcmdlVGV4dFRva2VucygpO1xuXG4gICAgdG9rZW5zID0gWy4uLnRva2Vucywge1xuICAgICAgICB0eXBlOiBFT0ZcbiAgICB9XTtcblxuICAgIGxldCByZWZzID0gaXNUYWdDbG9zZWQodG9rZW5zKTtcbiAgICBpZiAocmVmcy5tZXNzYWdlKSB7XG4gICAgICAgIHRocm93IHJlZnMubWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9rZW5zO1xufVxuIiwiZXhwb3J0IGNvbnN0IFR5cGVzID0ge1xuICAgIFByb2dyYW06ICdQcm9ncmFtJyxcbiAgICBJZjogJ0lmJyxcbiAgICBGb3I6ICdGb3InLFxuICAgIEVsZW1lbnQ6ICdFbGVtZW50JyxcbiAgICBBdHRyaWJ1dGU6ICdBdHRyaWJ1dGUnLFxuICAgIEV4cHJlc3Npb246ICdFeHByZXNzaW9uJyxcbiAgICBUZXh0OiAnVGV4dCcsXG4gICAgQ29tbWVudDogJ0NvbW1lbnQnLFxuICAgIEluY2x1ZGU6ICdJbmNsdWRlJ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFByb2dyYW0oYm9keSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFR5cGVzLlByb2dyYW0sXG4gICAgICAgIGJvZHlcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSWYodGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogVHlwZXMuSWYsXG4gICAgICAgIHRlc3QsXG4gICAgICAgIGFsdGVybmF0ZSxcbiAgICAgICAgY29uc2VxdWVudCxcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRm9yKHRlc3QsIGluaXQsIGJvZHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBUeXBlcy5Gb3IsXG4gICAgICAgIHRlc3QsXG4gICAgICAgIGluaXQsXG4gICAgICAgIGJvZHksXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVsZW1lbnQobmFtZSwgYXR0cmlidXRlcyA9IFtdLCBkaXJlY3RpdmVzID0gW10sIGNoaWxkcmVuID0gW10pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBUeXBlcy5FbGVtZW50LFxuICAgICAgICBuYW1lLFxuICAgICAgICBhdHRyaWJ1dGVzLFxuICAgICAgICBkaXJlY3RpdmVzLFxuICAgICAgICBjaGlsZHJlblxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJbmNsdWRlKGV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBUeXBlcy5JbmNsdWRlLFxuICAgICAgICBleHByZXNzaW9uXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFR5cGVzLkF0dHJpYnV0ZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdmFsdWVcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXhwcmVzc2lvbih2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFR5cGVzLkV4cHJlc3Npb24sXG4gICAgICAgIHZhbHVlXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRleHQgKHRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBUeXBlcy5UZXh0LFxuICAgICAgICB2YWx1ZTogdGV4dFxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21tZW50KGNvbW1lbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBUeXBlcy5Db21tZW50LFxuICAgICAgICB2YWx1ZTogY29tbWVudFxuICAgIH07XG59IiwiaW1wb3J0IExleGVyIGZyb20gJy4vTGV4ZXInO1xuaW1wb3J0IHtFTkRfVEFHLCBDT01NRU5ULCBUQUdOQU1FLCBDTE9TRV9UQUcsIEVYUFIsIFRFWFQsIEFUVFIsIFZBTFVFLCBFT0Z9IGZyb20nLi4vLi4vc2hhcmVkL1N0YXRlVHlwZXMnO1xuaW1wb3J0IHtQcm9ncmFtLCBJbmNsdWRlLCBJZiwgRm9yLCBFbGVtZW50LCBDb21tZW50LCBBdHRyaWJ1dGUsIEV4cHJlc3Npb24sIFRleHQsIFR5cGVzfSBmcm9tJy4uLy4uL3NoYXJlZC9Ob2RlVHlwZXMnO1xuaW1wb3J0IHtFeHByZXNzaW9uIGFzIGV4cHJlc3Npb24sIGlzSW5jbHVkZUV4cHJ9IGZyb20nLi9QYXJzZUV4cHJlc3Npb24nO1xuaW1wb3J0IHtpc1NlbGZDbG9zZSwgZXJyb3IsIGlzVm9pZFRhZ30gZnJvbScuLi8uLi9zaGFyZWQvaGVscGVyJztcblxuY29uc3QgU1RBVEVNRU5UX01BUksgPSAnOic7XG5jb25zdCBESVJFQ1RJVkVfTUFSSyA9ICdAJztcbmNvbnN0IElGX1NUQVRFTUVOVCA9IGAke1NUQVRFTUVOVF9NQVJLfWlmYDtcbmNvbnN0IElOQ0xVREVfU1RBVEVNRU5UID0gYCR7U1RBVEVNRU5UX01BUkt9aW5jbHVkZWA7XG5jb25zdCBFTFNFX1NUQVRFTUVOVCA9IGAke1NUQVRFTUVOVF9NQVJLfWVsc2VgO1xuY29uc3QgRUxTRV9JRl9TVEFURU1FTlQgPSBgJHtTVEFURU1FTlRfTUFSS31lbGlmYDtcbmNvbnN0IEZPUl9TVEFURU1FTlQgPSBgJHtTVEFURU1FTlRfTUFSS31mb3JgO1xuY29uc3QgRk9SX0lURU1fU1RBVEVNRU5UID0gYCR7U1RBVEVNRU5UX01BUkt9Zm9yLWl0ZW1gO1xuY29uc3QgRk9SX0lURU1fSU5ERVhfU1RBVEVNRU5UID0gYCR7U1RBVEVNRU5UX01BUkt9Zm9yLWluZGV4YDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFyc2VyKHNvdXJjZSkge1xuICAgIGxldCB0b2tlbnM7XG5cbiAgICB0cnkge1xuICAgICAgICB0b2tlbnMgPSBMZXhlcihzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yKCdFcnJvciBpbiBMZXhlcjogXFxuJyArIChlLnN0YWNrIHx8IGUpKTtcbiAgICB9XG5cbiAgICBsZXQgcG9zID0gMDtcblxuICAgIHJldHVybiBQcm9ncmFtKHByb2dyYW0odG9rZW5zKSk7XG5cbiAgICBmdW5jdGlvbiBsbChrID0gMCkge1xuICAgICAgICBwb3MgKz0gaztcblxuICAgICAgICBpZiAocG9zID4gdG9rZW5zLmxlbmd0aCAtIDEpe1xuICAgICAgICAgICAgcmV0dXJuIHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG9rZW5zW3Bvc107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGEoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbGwoLi4uYXJncykudHlwZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9ncmFtKCkge1xuICAgICAgICByZXR1cm4gZG9QYWNrYWdlKHR5cGUgPT4gdHlwZSAhPT0gRU5EX1RBRyAmJiB0eXBlICE9PSBFT0YpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRvUGFja2FnZShjb25kaXRpb24pIHtcbiAgICAgICAgY29uc3QgYm9keSA9IFtdO1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICBjb25kaXRpb24obGEoKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gcmVjdXJzZShib2R5KTtcblxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBib2R5LnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKG5vZGVzKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gbGwoKTtcbiAgICAgICAgY29uc3Qge3R5cGV9ID0gdG9rZW47XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFRBR05BTUU6XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudChub2Rlcyk7XG4gICAgICAgIGNhc2UgVEVYVDpcbiAgICAgICAgICAgIHJldHVybiB0ZXh0KCk7XG4gICAgICAgIGNhc2UgRVhQUjpcbiAgICAgICAgICAgIHJldHVybiBleHByKCk7XG4gICAgICAgIGNhc2UgQ09NTUVOVDpcbiAgICAgICAgICAgIHJldHVybiBjb21tZW50KCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRocm93ICd1bmtub3cgdG9rZW4gdHlwZSEnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGV4dCgpIHtcbiAgICAgICAgY29uc3Qge2NvbnRlbnR9ID0gbGwoKTtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgICByZXR1cm4gVGV4dChjb250ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21tZW50KCkge1xuICAgICAgICBjb25zdCB7Y29udGVudH0gPSBsbCgpO1xuICAgICAgICBuZXh0KCk7XG4gICAgICAgIHJldHVybiBDb21tZW50KGNvbnRlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVsZW1lbnQobm9kZXMpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBsbCgpO1xuICAgICAgICBjb25zdCB7Y29udGVudH0gPSB0b2tlbjtcblxuICAgICAgICBuZXh0KCk7XG5cbiAgICAgICAgbGV0IGNoaWxkcmVuLCBkaXJlY3RpdmVzLCBzdGF0ZW1lbnRzO1xuICAgICAgICBsZXQgYXR0ck5vZGVzID0gYXR0cnMoKTtcblxuICAgICAgICBjb25zdCByZWZzID0gcmVnZW5lcmF0ZUF0dHJzKGF0dHJOb2Rlcyk7XG5cbiAgICAgICAgYXR0ck5vZGVzID0gcmVmcy5hdHRycztcbiAgICAgICAgZGlyZWN0aXZlcyA9IHJlZnMuZGlyZWN0aXZlcztcbiAgICAgICAgc3RhdGVtZW50cyA9IHJlZnMuc3RhdGVtZW50cztcblxuICAgICAgICBjb25zdW1lKENMT1NFX1RBRyk7XG5cbiAgICAgICAgaWYgKCFpc1NlbGZDbG9zZSh0b2tlbikgJiYgIWlzVm9pZFRhZyhjb250ZW50KSkge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSBwcm9ncmFtKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWxlbWVudCA9IEVsZW1lbnQoXG4gICAgICAgICAgICBjb250ZW50LCBhdHRyTm9kZXMsIGRpcmVjdGl2ZXMsIGNoaWxkcmVuXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaWZOb2RlTGlzdCA9IG5vZGVzLmZpbHRlcigoe3R5cGV9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gVHlwZXMuSWY7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQgPSB3cmFwSW5jbHVkZVN0YXRlbWVudChlbGVtZW50LCBzdGF0ZW1lbnRzKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGxhc3RJZk5vZGUgPSBpZk5vZGVMaXN0W2lmTm9kZUxpc3QubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgZWxlbWVudCA9IHdyYXBFbHNlU3RhdGVtZW50KGVsZW1lbnQsIHN0YXRlbWVudHMsIGxhc3RJZk5vZGUpO1xuXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gd3JhcElmU3RhdGVtZW50KGVsZW1lbnQsIHN0YXRlbWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZXMuc3BsaWNlKG5vZGVzLmluZGV4T2YobGFzdElmTm9kZSkgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQgPSB3cmFwRm9yU3RhdGVtZW50KGVsZW1lbnQsIHN0YXRlbWVudHMpO1xuICAgICAgICBcblxuICAgICAgICBjb25zdW1lKEVORF9UQUcpO1xuXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyYXBJbmNsdWRlU3RhdGVtZW50KGVsZW1lbnQsIHN0YXRlbWVudHMpIHtcbiAgICAgICAgY29uc3QgaW5sdWRlc1ZhbHVlID0gc3RhdGVtZW50c1tJTkNMVURFX1NUQVRFTUVOVF07XG4gICAgICAgIGlmIChpbmx1ZGVzVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBJbmNsdWRlKGlubHVkZXNWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcEVsc2VTdGF0ZW1lbnQgKGVsZW1lbnQsIHN0YXRlbWVudHMsIGxhc3RJZk5vZGUpIHtcbiAgICAgICAgbGV0IGVsc2VJZlZhbHVlID0gc3RhdGVtZW50c1tFTFNFX0lGX1NUQVRFTUVOVF07XG5cbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlbWVudHMpO1xuXG4gICAgICAgIGlmIChsYXN0SWZOb2RlKSB7XG4gICAgICAgICAgICAvLyBmaW5kIHRoZSBlbXB0eSBhbHRlcm5hdGVcbiAgICAgICAgICAgIHdoaWxlIChsYXN0SWZOb2RlLmFsdGVybmF0ZSkge1xuICAgICAgICAgICAgICAgIGxhc3RJZk5vZGUgPSBsYXN0SWZOb2RlLmFsdGVybmF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGtleXMuaW5jbHVkZXMoRUxTRV9TVEFURU1FTlQpKSB7XG4gICAgICAgICAgICAgICAgbGFzdElmTm9kZS5hbHRlcm5hdGUgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbHNlSWZWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGxhc3RJZk5vZGUuYWx0ZXJuYXRlID0gSWYoZWxzZUlmVmFsdWUsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcElmU3RhdGVtZW50KGVsZW1lbnQsIHN0YXRlbWVudHMpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gc3RhdGVtZW50c1tJRl9TVEFURU1FTlRdO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBJZih2YWx1ZSwgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcEZvclN0YXRlbWVudChlbGVtZW50LCBzdGF0ZW1lbnRzKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHN0YXRlbWVudHNbRk9SX1NUQVRFTUVOVF07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIEZvcih2YWx1ZSwge1xuICAgICAgICAgICAgICAgIGl0ZW06IHN0YXRlbWVudHNbRk9SX0lURU1fU1RBVEVNRU5UXSB8fCBFeHByZXNzaW9uKGV4cHJlc3Npb24oJ2l0ZW0nKSksXG4gICAgICAgICAgICAgICAgaW5kZXg6IHN0YXRlbWVudHNbRk9SX0lURU1fSU5ERVhfU1RBVEVNRU5UXSB8fCBFeHByZXNzaW9uKGV4cHJlc3Npb24oJ2luZGV4JykpLFxuICAgICAgICAgICAgfSwgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVnZW5lcmF0ZUF0dHJzKGF0dHJOb2Rlcykge1xuICAgICAgICBjb25zdCBhdHRycyA9IFtdO1xuICAgICAgICBjb25zdCBzdGF0ZW1lbnRzID0ge307XG4gICAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBhdHRyIG9mIGF0dHJOb2Rlcykge1xuICAgICAgICAgICAgbGV0IHtuYW1lLCB2YWx1ZSA9ICcnfSA9IGF0dHI7XG4gICAgICAgICAgICBpZiAodmFsdWUudHlwZSAhPT0gVHlwZXMuRXhwcmVzc2lvbiAmJiBpc0luY2x1ZGVFeHByKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gRXhwcmVzc2lvbihleHByZXNzaW9uKHZhbHVlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoU1RBVEVNRU5UX01BUkspKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzdGF0ZW1lbnRzLCAoe1xuICAgICAgICAgICAgICAgICAgICBbbmFtZV06IHZhbHVlXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lLnN0YXJ0c1dpdGgoRElSRUNUSVZFX01BUkspKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gbmFtZS5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGRpcmVjdGl2ZXMsICh7XG4gICAgICAgICAgICAgICAgICAgIFtkaXJlY3RpdmVdOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChPYmplY3QuYXNzaWduKHt9LCBhdHRyLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHJzLCBzdGF0ZW1lbnRzLCBkaXJlY3RpdmVzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwcigpIHtcbiAgICAgICAgY29uc3QgZXhwciA9IGxsKCk7XG4gICAgICAgIG5leHQoKTtcbiAgICAgICAgcmV0dXJuIEV4cHJlc3Npb24oZXhwcmVzc2lvbihleHByLmNvbnRlbnQpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdHRycygpIHtcbiAgICAgICAgY29uc3QgYXR0cnMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGxhKCkgPT09IEFUVFIpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBsbCgpLmNvbnRlbnQ7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBjb25zdW1lKFZBTFVFKS5jb250ZW50O1xuXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBFeHByZXNzaW9uKGV4cHJlc3Npb24oY29uc3VtZShFWFBSKS5jb250ZW50KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgYXR0cnMucHVzaChhdHRyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgcG9zICsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN1bWUodHlwZSkge1xuICAgICAgICBsZXQgbWF0Y2hlZCA9IHt9O1xuICAgICAgICBpZiAobGEoKSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IGxsKCk7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoZWQ7XG4gICAgfVxufSIsImltcG9ydCB7Z2V0UHJvcHBlcnR5T2JqZWN0fSBmcm9tICcuL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKHRhZyA9ICcnLCBwcm9wcyA9IFtdLCBjb250ZXh0ID0ge30sIGNoaWxkcmVuID0gW10sIGxpbmtzID0ge30sIGtleSkge1xuICAgICAgICB0aGlzLmlzRWxhbWVudCA9IHRydWU7XG4gICAgICAgIHRoaXMudGFnID0gdGFnO1xuICAgICAgICB0aGlzLnByb3BzID0gQXJyYXkuaXNBcnJheShwcm9wcykgPyBnZXRQcm9wcGVydHlPYmplY3QocHJvcHMpOiBwcm9wcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLmxpbmtzID0gbGlua3M7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGUoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnQoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsb25lKGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgbmV3RWxlbWVudCA9IG5ldyBFbGVtZW50KCk7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ld0VsZW1lbnQsIGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0luc3RhbmNlKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC5pc0VsYW1lbnQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9FbGVtZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudHMgZXh0ZW5kcyBBcnJheSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaXNFbGVtZW50cyA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50cygpO1xuICAgIH1cblxuICAgIHB1c2goZWxlbWVudCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCB8fCB0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZydcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlci5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50cykge1xuICAgICAgICAgICAgZWxlbWVudC5mb3JFYWNoKFxuICAgICAgICAgICAgICAgIGl0ZW0gPT4gc3VwZXIucHVzaChpdGVtKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNJbnN0YW5jZShlbGVtZW50cykge1xuICAgICAgICByZXR1cm4gZWxlbWVudHMgJiYgZWxlbWVudHMuaXNFbGVtZW50cztcbiAgICB9XG59IiwiLy8gbGluayBlbGVtZW50IG9yIENvbXBvbmVudCBhcyB2RWxlbWVudFxuaW1wb3J0IHt1aWR9IGZyb20gJy4vaGVscGVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGluayhub2RlLCBlbGVtZW50KSB7XG4gICAgY29uc3Qge2xpbmtzfSA9IGVsZW1lbnQ7XG4gICAgY29uc3Qgb25kZXN0cm95ID0gT2JqZWN0LmtleXMobGlua3MpLm1hcChcbiAgICAgICAgKG5hbWUpID0+ICB7XG4gICAgICAgICAgICBjb25zdCB7bGluaywgYmluZGluZ30gPSBsaW5rc1tuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBsaW5rKG5vZGUsIGJpbmRpbmcsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGVsZW1lbnQub25kZXN0cm95ID0gKCkgPT4ge1xuICAgICAgICBvbmRlc3Ryb3kuZm9yRWFjaChpdGVtID0+IGl0ZW0oKSk7XG4gICAgfTtcblxuICAgIGVsZW1lbnQub25kZXN0cm95LmlkID0gdWlkKCk7XG59IiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9FbGVtZW50JztcbmltcG9ydCBsaW5rIGZyb20gJy4vbGluayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZDb21wb25lbnQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpOyBcbiAgICB9XG5cbiAgICBzZXRDb25zdHJ1Y3Rvcihjb25zdHJ1Y3Rvcikge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgY29uc3Qge2NvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvciwgcHJvcHMsIGNoaWxkcmVuLCBjb250ZXh0fSA9IHRoaXM7IFxuICAgIFxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgc3RhdGU6IHByb3BzLFxuICAgICAgICAgICAgYm9keTogY2hpbGRyZW4sXG4gICAgICAgICAgICBjb250ZXh0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpbmsoY29tcG9uZW50LCB0aGlzKTtcbiAgICBcbiAgICAgICAgdGhpcy5yZWYgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWQ29tcG9uZW50KC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0luc3RhbmNlKHNvbWV0aGluZykge1xuICAgICAgICByZXR1cm4gc29tZXRoaW5nIGluc3RhbmNlb2YgVkNvbXBvbmVudDtcbiAgICB9XG59IiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi4vLi4vc2hhcmVkL0VsZW1lbnQnO1xuaW1wb3J0IEVsZW1lbnRzIGZyb20gJy4uLy4uL3NoYXJlZC9FbGVtZW50cyc7XG5pbXBvcnQgVkNvbXBvbmVudCBmcm9tICcuLi8uLi9zaGFyZWQvVkNvbXBvbmVudCc7XG5pbXBvcnQgbGluayBmcm9tICcuLi8uLi9zaGFyZWQvbGluayc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50cyhlbGVtZW50cywgcGFyZW50KSB7XG4gICAgZWxlbWVudHMuZm9yRWFjaChcbiAgICAgICAgZWxlbWVudCA9PiBhcHBlbmRFbGVtZW50KGVsZW1lbnQsIHBhcmVudClcbiAgICApO1xuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRFbGVtZW50KGVsZW1lbnQsIHBhcmVudCkge1xuICAgIGlmIChWQ29tcG9uZW50LmlzSW5zdGFuY2UoZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudC5jcmVhdGUoKS5tb3VudChwYXJlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtZW50KGVsZW1lbnQsIHBhcmVudCkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHtwcm9wcywgdGFnLCBjaGlsZHJlbn0gPSBlbGVtZW50O1xuICAgIGxldCBub2RlO1xuXG4gICAgaWYgKEVsZW1lbnQuaXNJbnN0YW5jZShlbGVtZW50KSkge1xuICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG4gICAgICAgIGNyZWF0ZUVsZW1lbnRzKGNoaWxkcmVuLCBub2RlKTsgLy8gY2hpbGRyZW5cbiAgICAgICAgbGluayhub2RlLCBlbGVtZW50KTsgICAgICAgICAvLyBsaW5rc1xuICAgICAgICBzZXRQcm9wcyhub2RlLCBwcm9wcyk7ICAgICAgIC8vIHByb3BzXG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudHMpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTsgLy8gcGFja2FnZVxuICAgICAgICBjcmVhdGVFbGVtZW50cyhlbGVtZW50LCBub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9wcyhub2RlLCBwcm9wcykge1xuICAgIE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIGlmIChwcm9wc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCBwcm9wc1tuYW1lXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U3R5bGUobm9kZSwgc3R5bGVzKSB7XG4gICAgT2JqZWN0LmFzc2lnbihub2RlLnN0eWxlLCBzdHlsZXMpO1xufVxuXG4iLCJleHBvcnQgY29uc3QgU1RBVEUgPSBTeW1ib2woJ3N0YXRlJyk7XG5leHBvcnQgY29uc3QgTUVUSE9EUyA9IFN5bWJvbCgnbWV0aG9kcycpO1xuZXhwb3J0IGNvbnN0IERJUkVDVElWRVMgPSBTeW1ib2woJ2RpcmVjdGl2ZXMnKTtcbmV4cG9ydCBjb25zdCBDT01QT05FTlRTID0gU3ltYm9sKCdjb21wb25lbnRzJyk7XG5leHBvcnQgY29uc3QgRVZFTlRTID0gU3ltYm9sKCdldmVudHMnKTtcbmV4cG9ydCBjb25zdCBDT01QVVRFRCA9ICdjb21wdXRlZCc7XG5cbmV4cG9ydCBjb25zdCBBU1QgPSBTeW1ib2woJ2FzdCcpO1xuZXhwb3J0IGNvbnN0IFZET00gPSAndkRPTSc7ICAvLyBTeW1ib2woJ3ZET00nKTtcbmV4cG9ydCBjb25zdCBSRE9NID0gJ3JET00nOyAgLy8gU3ltYm9sKCdyRE9NJyk7XG5leHBvcnQgY29uc3QgRVZFTlQgPSAnZXZlbnQnOyAvL1N5bWJvbCgnZXZlbnQnKTtcblxuZXhwb3J0IGNvbnN0IEJMT0NLID0gJ2Jsb2NrJztcblxuZXhwb3J0IGNvbnN0IFRFWFQgPSAndGV4dCc7XG5leHBvcnQgY29uc3QgU1RZTEUgPSAnc3R5bGUnO1xuZXhwb3J0IGNvbnN0IFBST1BTID0gJ3Byb3BzJztcbmV4cG9ydCBjb25zdCBSRVBMQUNFID0gJ3JlcGxhY2UnO1xuZXhwb3J0IGNvbnN0IFJFTU9WRSA9ICdyZW1vdmUnO1xuZXhwb3J0IGNvbnN0IE5FVyA9ICduZXcnO1xuZXhwb3J0IGNvbnN0IFJFTElOSyA9ICdyZWxpbmsnO1xuXG5leHBvcnQgY29uc3QgTU9ESUZZX0JPRFkgPSAnbW9kaWZ5Qm9keSc7IiwiaW1wb3J0IHthcHBlbmRFbGVtZW50LCBjcmVhdGVFbGVtZW50LCBzZXRQcm9wcywgc2V0U3R5bGV9IGZyb20gJy4vY3JlYXRlRWxlbWVudCc7XG5pbXBvcnQge2RlYnVnfSBmcm9tICcuLi8uLi9zaGFyZWQvaGVscGVyJztcbmltcG9ydCB7VEVYVCwgU1RZTEUsIFBST1BTLCBSRVBMQUNFLCBSRUxJTkssIFJFTU9WRSwgTkVXfSBmcm9tICcuLi8uLi9zaGFyZWQvY29uc3RhbnQnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi4vLi4vc2hhcmVkL0VsZW1lbnQnO1xuaW1wb3J0IGxpbmsgZnJvbSAnLi4vLi4vc2hhcmVkL2xpbmsnO1xuXG5mdW5jdGlvbiB3YWxrRE9NKHRyZWUsIGZuLCBpbmRleCA9IC0xKSB7XG4gICAgdHJlZS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBmbihpdGVtLCArK2luZGV4KTtcbiAgICAgICAgaWYgKGl0ZW0uY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpbmRleCA9IHdhbGtET00oaXRlbS5jaGlsZE5vZGVzLCBmbiwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGluZGV4O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXRjaChkb20sIHBhdGNoZXMpIHtcbiAgICBkZWJ1ZygnZG9tOicpO1xuICAgIGRlYnVnKGRvbSk7XG4gICAgZGVidWcoJ3BhdGNoZXM6Jyk7XG4gICAgZGVidWcocGF0Y2hlcyk7XG4gICAgZnVuY3Rpb24gcGF0Y2hFbGVtZW50KG5vZGUsIHBhcmVudCwgbmV4dEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIChjdXJyZW50UGF0Y2gpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHt0eXBlLCBjaGFuZ2VkLCBzb3VyY2V9ID0gY3VycmVudFBhdGNoO1xuICAgICAgICAgICAgbGV0IG9yaWdpbjtcblxuICAgICAgICAgICAgaWYgKEVsZW1lbnQuaXNJbnN0YW5jZShjaGFuZ2VkKSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbiA9IGNoYW5nZWQub3JpZ2luO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY2hhbmdlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW4gPSBjaGFuZ2VkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBTVFlMRTpcbiAgICAgICAgICAgICAgICBzZXRTdHlsZShub2RlLnN0eWxlLCBjaGFuZ2VkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBQUk9QUzpcbiAgICAgICAgICAgICAgICBzZXRQcm9wcyhub2RlLCBjaGFuZ2VkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBURVhUOlxuICAgICAgICAgICAgICAgIG5vZGVbbm9kZS50ZXh0Q29udGVudCA/ICd0ZXh0Q29udGVudCcgOiAnbm9kZVZhbHVlJ10gPSBjaGFuZ2VkOyAvLyBmdWNrIGllXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgTkVXOlxuICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY3JlYXRlRWxlbWVudChvcmlnaW4pLCBuZXh0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgLy8gYXBwZW5kRWxlbWVudChvcmlnaW4sIHBhcmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgUkVQTEFDRTpcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLm9uZGVzdHJveSkge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2Uub25kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQoY3JlYXRlRWxlbWVudChvcmlnaW4pLCBub2RlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBSRU1PVkU6XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5vbmRlc3Ryb3kpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlLm9uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSBbXTtcblxuICAgIHdhbGtET00oZG9tLCAobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGlzdFtpbmRleF0gPSBub2RlO1xuICAgIH0pO1xuXG4gICAgLy8gd2FsayB0aGUgZGlmZmVyZW5jZSBzZXQgYW5kIHVwZGF0ZVxuICAgIGxpc3QuZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHBhdGNoZXNbaW5kZXhdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhdGNoZXNbaW5kZXhdLmZvckVhY2goXG4gICAgICAgICAgICAgICAgcGF0Y2hFbGVtZW50KG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgbm9kZS5uZXh0U2libGluZylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGxpc3QubGVuZ3RoID0gMDsgLy8gZ2Ncbn0iLCJpbXBvcnQgVkNvbXBvbmVudCBmcm9tICcuLi9zaGFyZWQvVkNvbXBvbmVudCc7XG5pbXBvcnQge2RlYnVnLCB1aWR9IGZyb20gJy4uL3NoYXJlZC9oZWxwZXInO1xuXG5jb25zdCBpZCA9IHVpZCgpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgJy9vbi0uKi8nOiAoZWxlbSwgYmluZGluZywgdm5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qge25hbWUsIHZhbHVlfSA9IGJpbmRpbmc7XG4gICAgICAgIGRlYnVnKCduYW1lOicpO1xuICAgICAgICBkZWJ1ZyhuYW1lKTtcblxuICAgICAgICBjb25zdCBkb1NvbXRoaW5nID0gKCRldmVudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlKHskZXZlbnR9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb1NvbXRoaW5nLmlkID0gaWQoKTtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuYW1lLnNsaWNlKDMpO1xuICAgICAgICBcbiAgICAgICAgaWYgKFZDb21wb25lbnQuaXNJbnN0YW5jZSh2bm9kZSkpIHtcbiAgICAgICAgICAgIGVsZW0ub24oZXZlbnQsIGRvU29tdGhpbmcpO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBkb1NvbXRoaW5nKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGRvU29tdGhpbmcpO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGRvU29tdGhpbmcpOyBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHJlZihlbGVtLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgICAgICBjb25zdCB7dmFsdWUsIGNvbnRleHR9ID0gYmluZGluZztcbiAgICAgICAgXG4gICAgICAgIGNvbnRleHQucmVmc1t2YWx1ZSgpXSA9IGVsZW07XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb250ZXh0LnJlZnNbdmFsdWVdID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG59OyIsImltcG9ydCB7RVZFTlR9IGZyb20gJy4uL3NoYXJlZC9jb25zdGFudCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBvbiguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzW0VWRU5UXS5vbiguLi5hcmdzKTtcbiAgICB9LFxuXG4gICAgb25jZSguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzW0VWRU5UXS5vbmNlKC4uLmFyZ3MpO1xuICAgIH0sXG5cbiAgICBlbWl0KC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbRVZFTlRdLmVtaXQoLi4uYXJncyk7XG4gICAgfSxcblxuICAgIHJlbW92ZUxpc3RlbmVyKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbRVZFTlRdLnJlbW92ZUxpc3RlbmVyKC4uLmFyZ3MpO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gdGhpc1tFVkVOVF0ucmVtb3ZlQWxsTGlzdGVuZXJzKC4uLmFyZ3MpO1xuICAgIH1cbn07IiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi4vLi4vc2hhcmVkL0VsZW1lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3YWxrVkRPTShsYXN0VCA9IFtdLCBuZXh0VCA9IFtdLCBmbiwgaW5kZXggPSAtMSkge1xuICAgIGZ1bmN0aW9uIGhhc0NoaWxkKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIChFbGVtZW50LmlzSW5zdGFuY2UoZWxlbWVudCkgJiYgZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKTtcbiAgICB9XG5cbiAgICBsYXN0VC5mb3JFYWNoKChsYXN0LCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXh0VFtpXTtcbiAgICAgICAgZm4obGFzdCwgbmV4dCwgKytpbmRleCk7XG5cbiAgICAgICAgaWYgKGhhc0NoaWxkKGxhc3QpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hpbGRyZW4gPSBoYXNDaGlsZChuZXh0KSA/IG5leHQuY2hpbGRyZW4gOiBbXTtcbiAgICAgICAgICAgIGluZGV4ID0gd2Fsa1ZET00obGFzdC5jaGlsZHJlbiwgbmV4dENoaWxkcmVuLCBmbiwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobmV4dFQubGVuZ3RoID4gbGFzdFQubGVuZ3RoKSB7XG4gICAgICAgIG5leHRULnNsaWNlKGxhc3RULmxlbmd0aCkuZm9yRWFjaChcbiAgICAgICAgICAgIChuZXh0KSA9PlxuICAgICAgICAgICAgICAgIGZuKHZvaWQgMCwgbmV4dCwgaW5kZXgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZGV4O1xufVxuIiwiaW1wb3J0IHtpc0VtcHR5LCBpc09iamVjdCwgaXNEYXRlLCBwcm9wZXJPYmplY3R9IGZyb20gJy4vaGVscGVyJztcblxuZnVuY3Rpb24gZGlmZihsaHMsIHJocykge1xuICAgIGlmIChsaHMgPT09IHJocykgcmV0dXJuIHt9OyAvLyBlcXVhbCByZXR1cm4gbm8gZGlmZlxuXG4gICAgaWYgKCFpc09iamVjdChsaHMpIHx8ICFpc09iamVjdChyaHMpKSByZXR1cm4gcmhzOyAvLyByZXR1cm4gdXBkYXRlZCByaHNcblxuICAgIGNvbnN0IGwgPSBwcm9wZXJPYmplY3QobGhzKTtcbiAgICBjb25zdCByID0gcHJvcGVyT2JqZWN0KHJocyk7XG5cbiAgICBjb25zdCBkZWxldGVkVmFsdWVzID0gT2JqZWN0LmtleXMobCkucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICByZXR1cm4gci5oYXNPd25Qcm9wZXJ0eShrZXkpID8gYWNjIDogT2JqZWN0LmFzc2lnbih7fSwgYWNjLCB7W2tleV06IHVuZGVmaW5lZCB9KTtcbiAgICB9LCB7fSk7XG5cbiAgICBpZiAoaXNEYXRlKGwpIHx8IGlzRGF0ZShyKSkge1xuICAgICAgICBpZiAobC52YWx1ZU9mKCkgPT0gci52YWx1ZU9mKCkpIHJldHVybiB7fTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHIpLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFsLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhY2MsIHtba2V5XTogcltrZXldIH0pOyAvLyByZXR1cm4gYWRkZWQgciBrZXlcblxuICAgICAgICBjb25zdCBkaWZmZXJlbmNlID0gZGlmZihsW2tleV0sIHJba2V5XSk7XG5cbiAgICAgICAgaWYgKGlzT2JqZWN0KGRpZmZlcmVuY2UpICYmIGlzRW1wdHkoZGlmZmVyZW5jZSkgJiYgIWlzRGF0ZShkaWZmZXJlbmNlKSkgcmV0dXJuIGFjYzsgLy8gcmV0dXJuIG5vIGRpZmZcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYWNjLCB7W2tleV06IGRpZmZlcmVuY2UgfSk7IC8vIHJldHVybiB1cGRhdGVkIGtleVxuICAgIH0sIGRlbGV0ZWRWYWx1ZXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkaWZmO1xuIiwiaW1wb3J0IHtkZWJ1ZywgaXNFbXB0eX0gZnJvbSAnLi4vLi4vc2hhcmVkL2hlbHBlcic7XG5pbXBvcnQgZGlmZiBmcm9tICcuLi8uLi9zaGFyZWQvZGlmZic7XG5pbXBvcnQge1RFWFQsIFNUWUxFLCBQUk9QUywgUkVQTEFDRSwgUkVMSU5LLCBSRU1PVkUsIE5FVywgIE1PRElGWV9CT0RZLCBTVEFURX0gZnJvbSAnLi4vLi4vc2hhcmVkL2NvbnN0YW50JztcbmltcG9ydCBWQ29tcG9uZW50IGZyb20gJy4uLy4uL3NoYXJlZC9WQ29tcG9uZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlmZkl0ZW0obGFzdCwgbmV4dCkge1xuICAgIGlmIChsYXN0ID09PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICB0eXBlOiBORVcsXG4gICAgICAgICAgICBjaGFuZ2VkOiBuZXh0XG4gICAgICAgIH1dO1xuICAgIH0gXG4gICAgXG4gICAgaWYgKG5leHQgPT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIHR5cGU6IFJFTU9WRSxcbiAgICAgICAgICAgIHNvdXJjZTogbGFzdFxuICAgICAgICB9XTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGxhc3QgPT09IHR5cGVvZiBuZXh0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGFzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChsYXN0ICE9PSBuZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFRFWFQsXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQ6IG5leHRcbiAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgdHlwZTogUkVQTEFDRSxcbiAgICAgICAgICAgIHNvdXJjZTogbGFzdCxcbiAgICAgICAgICAgIGNoYW5nZWQ6IG5leHRcbiAgICAgICAgfV07XG4gICAgfVxuXG4gICAgY29uc3QgZGlmID0gW107XG5cbiAgICAvLyBjb25kaXRpb24gb3RoZXIgY2hhbmdlcyAoc3VjaCBhcyBldmVudHMgZWcuKVxuICAgIGlmIChsYXN0LnRhZyAhPT0gbmV4dC50YWcpIHtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICB0eXBlOiBSRVBMQUNFLFxuICAgICAgICAgICAgc291cmNlOiBsYXN0LFxuICAgICAgICAgICAgY2hhbmdlZDogbmV4dFxuICAgICAgICB9XTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IGRpZmYobGFzdC5wcm9wcy5zdHlsZSwgbmV4dC5wcm9wcy5zdHlsZSk7XG4gICAgaWYgKCFpc0VtcHR5KHN0eWxlKSkge1xuICAgICAgICBkaWYucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBTVFlMRSxcbiAgICAgICAgICAgIGNoYW5nZWQ6IHN0eWxlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BzID0gZGlmZihsYXN0LnByb3BzLCBuZXh0LnByb3BzKTtcbiAgICBpZiAoIWlzRW1wdHkocHJvcHMpKSB7XG4gICAgICAgIGRpZi5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IFBST1BTLFxuICAgICAgICAgICAgY2hhbmdlZDogcHJvcHNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKFZDb21wb25lbnQuaXNJbnN0YW5jZShsYXN0KSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGRpZmYobGFzdC5jaGlsZHJlbiwgbmV4dC5jaGlsZHJlbik7XG4gICAgICAgIGlmICghaXNFbXB0eShjaGlsZHJlbikpIHtcbiAgICAgICAgICAgIGRpZi5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBNT0RJRllfQk9EWSxcbiAgICAgICAgICAgICAgICBjaGFuZ2VkOiBuZXh0LmNoaWxkcmVuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkaWY7XG59IiwiaW1wb3J0IGxpbmsgZnJvbSAnLi4vLi4vc2hhcmVkL2xpbmsnO1xuaW1wb3J0IHthc3NpZ25QcmltaXRpdmV9IGZyb20gJy4uLy4uL3NoYXJlZC9oZWxwZXInO1xuaW1wb3J0IHtORVcsIFZET00sIFBST1BTLCBSRVBMQUNFLCBSRUxJTkssIFJFTU9WRSwgU1RBVEUsIE1PRElGWV9CT0RZfSBmcm9tICcuLi8uLi9zaGFyZWQvY29uc3RhbnQnO1xuaW1wb3J0IHdhbGtWRE9NIGZyb20gJy4vd2Fsayc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuLi8uLi9zaGFyZWQvRWxlbWVudCc7XG5pbXBvcnQgVkNvbXBvbmVudCBmcm9tICcuLi8uLi9zaGFyZWQvVkNvbXBvbmVudCc7XG5pbXBvcnQgZGlmZlZFbGVtZW50IGZyb20gJy4vZGlmZkl0ZW0nO1xuXG5cbmZ1bmN0aW9uIGNvcHlWRWxlbWVudFN0YXRlIChmcm9tLCB0bykge1xuICAgIGlmIChcbiAgICAgICAgRWxlbWVudC5pc0luc3RhbmNlKHRvKVxuICAgICAgICAmJiBFbGVtZW50LmlzSW5zdGFuY2UoZnJvbSlcbiAgICAgICAgJiYgIXRvLm9uZGVzdHJveVxuICAgICkge1xuICAgICAgICB0by5vbmRlc3Ryb3kgPSBmcm9tLm9uZGVzdHJveTtcbiAgICAgICAgXG4gICAgICAgIGlmIChWQ29tcG9uZW50LmlzSW5zdGFuY2UoZnJvbSkgJiYgVkNvbXBvbmVudC5pc0luc3RhbmNlKHRvKSkge1xuICAgICAgICAgICAgdG8ucmVmID0gZnJvbS5yZWY7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhdGNoQ29tcG9uZW50cyhsYXN0VCwgbmV4dFQpIHtcbiAgICB3YWxrVkRPTShsYXN0VCwgbmV4dFQsIChsYXN0LCBuZXh0KSA9PiB7XG4gICAgICAgIGNvcHlWRWxlbWVudFN0YXRlKGxhc3QsIG5leHQpO1xuXG4gICAgICAgIGNvbnN0IGlzUGF0Y2hlZENvbXBvbmVudCA9IFZDb21wb25lbnQuaXNJbnN0YW5jZShsYXN0KSB8fCBWQ29tcG9uZW50LmlzSW5zdGFuY2UobmV4dCk7XG4gICAgICAgIGlmIChpc1BhdGNoZWRDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRpZmZWRWxlbWVudChsYXN0LCBuZXh0KTtcbiAgICAgICAgICAgIHJlc3VsdC5mb3JFYWNoKFxuICAgICAgICAgICAgICAgIGl0ZW0gPT4gXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoQ29tcG9uZW50KE9iamVjdC5hc3NpZ24oe30sIGl0ZW0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogbmV4dFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGVtcHR5YXJyYXkgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHZET00gPSB7XG4gICAgICAgICAgICAgICAgbGFzdDogZW1wdHlhcnJheSxcbiAgICAgICAgICAgICAgICBuZXh0OiBlbXB0eWFycmF5XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAobGFzdCAmJiBsYXN0LnJlZikge1xuICAgICAgICAgICAgICAgIHZET00ubGFzdCA9IGxhc3QucmVmW1ZET01dO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0LnJlZikge1xuICAgICAgICAgICAgICAgIG5leHQucmVmW1ZET01dID0gdkRPTS5uZXh0ID0gbmV4dC5yZWYucmVuZGVyKG5leHQucHJvcHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXRjaENvbXBvbmVudHModkRPTS5sYXN0LCB2RE9NLm5leHQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hDb21wb25lbnQoe1xuICAgIHR5cGUsIHNvdXJjZSA9IHt9LCBjaGFuZ2VkID0ge30sIHRhcmdldFxufSkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IHNvdXJjZS5yZWY7XG4gICAgY29uc3QgcGF0Y2ggPSBbXTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIE1PRElGWV9CT0RZOlxuICAgICAgICB0YXJnZXQucmVmLmJvZHkgPSBjaGFuZ2VkO1xuICAgICAgICBicmVhaztcblxuICAgIGNhc2UgUFJPUFM6XG4gICAgICAgIC8vIGNvbXBvbmVudFtTVEFURV0gPSBPYmplY3QuYXNzaWduKGNvbXBvbmVudC5zdGF0ZSwgdGFyZ2V0LnByb3BzKTtcbiAgICAgICAgYXNzaWduUHJpbWl0aXZlKGNvbXBvbmVudFtTVEFURV0sIGNoYW5nZWQpO1xuICAgICAgICBicmVhaztcblxuICAgIGNhc2UgTkVXOlxuICAgICAgICB0YXJnZXQuY3JlYXRlKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBSRVBMQUNFOlxuICAgICAgICBpZiAoVkNvbXBvbmVudC5pc0luc3RhbmNlKHNvdXJjZSkgJiYgVkNvbXBvbmVudC5pc0luc3RhbmNlKHRhcmdldCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0YXJnZXQuY3JlYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVkNvbXBvbmVudC5pc0luc3RhbmNlKHNvdXJjZSkgJiYgIVZDb21wb25lbnQuaXNJbnN0YW5jZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LmNyZWF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICBjYXNlIFJFTU9WRTpcbiAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgdGFyZ2V0LnJlZiA9IGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0Y2g7XG59IiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9FbGVtZW50JztcbmltcG9ydCBWQ29tcG9uZW50IGZyb20gJy4vVkNvbXBvbmVudCc7XG5pbXBvcnQge1ZET019IGZyb20gJy4vY29uc3RhbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWVHJlZSh2VHJlZSkge1xuICAgIGxldCB0ZW1wID0gW107XG5cbiAgICB2VHJlZS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChWQ29tcG9uZW50LmlzSW5zdGFuY2UoaXRlbSkpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLnJlZikge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBbXG4gICAgICAgICAgICAgICAgICAgIC4uLnRlbXAsXG4gICAgICAgICAgICAgICAgICAgIC4uLmdldFZUcmVlKGl0ZW0ucmVmW1ZET01dKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXAucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChFbGVtZW50LmlzSW5zdGFuY2UoaXRlbSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvcHkgPSBFbGVtZW50LmNsb25lKGl0ZW0pO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBnZXRWVHJlZShpdGVtLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIGNvcHkuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgICAgIGNvcHkub3JpZ2luID0gaXRlbTtcbiAgICAgICAgICAgIHRlbXAucHVzaChjb3B5KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICB0ZW1wLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGVtcDtcbn0iLCJpbXBvcnQgd2Fsa1ZET00gZnJvbSAnLi93YWxrJztcbmltcG9ydCBwYXRjaENvbXBvbmVudHMgZnJvbSAnLi9wYXRjaENvbXBvbmVudHMnO1xuaW1wb3J0IGRpZmZWRWxlbWVudCBmcm9tICcuL2RpZmZJdGVtJztcbmltcG9ydCBnZXRWVHJlZSBmcm9tICcuLi8uLi9zaGFyZWQvZ2V0VlRyZWUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpZmZWRE9NKGxhc3RULCBuZXh0VCkgeyAvLyDorrIgdmlydHVhbCBkb20g55qE57uE5Lu25YWo6YOo5pu/5o2i5Li6IOiKgueCueS5i+WQju+8jOWGjSBkaWZmXG4gICAgY29uc3QgcGF0Y2hlcyA9IHt9O1xuICAgIGNvbnN0IHZMYXN0VCA9IGdldFZUcmVlKGxhc3RUKTtcbiAgICBwYXRjaENvbXBvbmVudHMobGFzdFQsIG5leHRUKTtcblxuICAgIGNvbnN0IHZOZXh0VCA9IGdldFZUcmVlKG5leHRUKTtcblxuICAgIHdhbGtWRE9NKHZMYXN0VCwgdk5leHRULCAobGFzdCwgbmV4dCwgaSkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBkaWZmVkVsZW1lbnQobGFzdCwgbmV4dCk7XG5cbiAgICAgICAgaWYgKCFwYXRjaGVzW2ldKSB7XG4gICAgICAgICAgICBwYXRjaGVzW2ldID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBwYXRjaGVzW2ldID0gW1xuICAgICAgICAgICAgLi4ucGF0Y2hlc1tpXSwgXG4gICAgICAgICAgICAuLi5yZXN1bHRcbiAgICAgICAgXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwYXRjaGVzOyAvLyBkaWZmZXJlbmNlIHNldFxufVxuXG5cbiIsImltcG9ydCB7d2FybiwgZGVidWd9IGZyb20gJy4uLy4uL3NoYXJlZC9oZWxwZXInO1xuXG5jb25zdCBleHByZXNzaW9uTWFwID0gbmV3IE1hcCgpO1xuY29uc3QgY29tcHV0ZSA9IChjb21wdXRlZCkgPT4ge1xuICAgIGNvbnN0IGNvbXB1dGVkUmVzdWx0ID0gT2JqZWN0LmtleXMoY29tcHV0ZWQpLnJlZHVjZSgocmVzdWx0LCBpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHJlc3VsdCwge1xuICAgICAgICAgICAgW2l0ZW1dOiB0eXBlb2YgY29tcHV0ZWRbaXRlbV0gPT09ICdmdW5jdGlvbic/IGNvbXB1dGVkW2l0ZW1dKCk6IGNvbXB1dGVkW2l0ZW1dXG4gICAgICAgIH0pO1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gY29tcHV0ZWRSZXN1bHQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEV4cHJlc3Npb24oZXhwcmVzc2lvbiwge3N0YXRlLCBtZXRob2RzLCBjb250ZXh0LCBjb21wdXRlZCA9IHt9fSkge1xuICAgIC8vIGNhY2hlIGV4cHJlc3Npb25cbiAgICBpZiAoIWV4cHJlc3Npb25NYXAuZ2V0KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGNvbnN0IGV4cHIgPSBjb2RlR2VuKGV4cHJlc3Npb24pO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gYFxuICAgICAgICAgICAgd2l0aChjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR7ZXhwcn07XG4gICAgICAgICAgICB9XG4gICAgICAgIGA7XG4gICAgICAgIGV4cHJlc3Npb25NYXAuc2V0KGV4cHJlc3Npb24sIG5ldyBGdW5jdGlvbignY29udGV4dCcsIGNvbnRlbnQpKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlRm4gPSBleHByZXNzaW9uTWFwLmdldChleHByZXNzaW9uKTtcbiAgICBjb25zdCBzY29wZSA9IE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMsIHN0YXRlLCBjb21wdXRlKGNvbXB1dGVkKSk7XG4gICAgZGVidWcoY29kZUZuKTtcbiAgICByZXR1cm4gY29kZUZuLmNhbGwoY29udGV4dCwgc2NvcGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlbihleHByZXNzaW9uKSB7XG4gICAgY29uc3Qge3R5cGV9ID0gZXhwcmVzc2lvbjtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdFeHByZXNzaW9uJzpcbiAgICAgICAgcmV0dXJuIGNvZGVHZW4oZXhwcmVzc2lvbi52YWx1ZSk7XG5cbiAgICBjYXNlICdJZGVudGlmaWVyJzpcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb24ubmFtZTtcblxuICAgIGNhc2UgJ0JpbmFyeUV4cHJlc3Npb24nOlxuICAgIGNhc2UgJ0xvZ2ljYWxFeHByZXNzaW9uJzoge1xuICAgICAgICBjb25zdCBsZWZ0ID0gY29kZUdlbihleHByZXNzaW9uLmxlZnQpO1xuICAgICAgICBjb25zdCByaWdodCA9IGNvZGVHZW4oZXhwcmVzc2lvbi5yaWdodCk7XG4gICAgICAgIHJldHVybiBgJHtsZWZ0fSR7ZXhwcmVzc2lvbi5vcGVyYXRvcn0ke3JpZ2h0fWA7XG4gICAgfVxuXG4gICAgY2FzZSAnTWVtYmVyRXhwcmVzc2lvbic6IHtcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gY29kZUdlbihleHByZXNzaW9uLm9iamVjdCk7XG4gICAgICAgIGxldCBwcm9wZXJ0eSA9IGNvZGVHZW4oZXhwcmVzc2lvbi5wcm9wZXJ0eSk7XG4gICAgICAgIHByb3BlcnR5ID0gKGV4cHJlc3Npb24uY29tcHV0ZWQpID8gcHJvcGVydHk6ICgnXCInK3Byb3BlcnR5KydcIicpO1xuICAgICAgICByZXR1cm4gYCR7b2JqZWN0fVske3Byb3BlcnR5fV1gO1xuICAgIH1cblxuICAgIGNhc2UgJ0NvbXBvdW5kJzoge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgLy8gZGVidWdnZXJcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY2FzZSAnTGl0ZXJhbCc6XG4gICAgICAgIHJldHVybiBleHByZXNzaW9uLnJhdztcblxuICAgIGNhc2UgJ0NhbGxFeHByZXNzaW9uJzoge1xuICAgICAgICBjb25zdCBjYWxsZWUgPSBjb2RlR2VuKGV4cHJlc3Npb24uY2FsbGVlKTtcbiAgICAgICAgY29uc3QgYXJncyA9IGV4cHJlc3Npb24uYXJndW1lbnRzLm1hcChjb2RlR2VuKTtcbiAgICAgICAgcmV0dXJuIGAke2NhbGxlZX0oJHthcmdzLmpvaW4oJywnKX0pYDtcbiAgICB9XG5cbiAgICBjYXNlICdUaGlzRXhwcmVzc2lvbic6XG4gICAgICAgIHJldHVybiAndGhpcyc7XG5cbiAgICBjYXNlICdVbmFyeUV4cHJlc3Npb24nOiB7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gZXhwcmVzc2lvbi5vcGVyYXRvcjtcbiAgICAgICAgY29uc3QgYXJndW1lbnQgPSBjb2RlR2VuKGV4cHJlc3Npb24uYXJndW1lbnQpO1xuICAgICAgICByZXR1cm4gYCR7b3BlcmF0b3J9KCR7YXJndW1lbnR9KWA7XG4gICAgfVxuXG4gICAgY2FzZSAnQ29uZGl0aW9uYWxFeHByZXNzaW9uJzoge1xuICAgICAgICBjb25zdCB0ZXN0ID0gY29kZUdlbihleHByZXNzaW9uLnRlc3QpO1xuICAgICAgICBjb25zdCBjb25zZXF1ZW50ID0gY29kZUdlbihleHByZXNzaW9uLmNvbnNlcXVlbnQpO1xuICAgICAgICBjb25zdCBhbHRlcm5hdGUgPSBjb2RlR2VuKGV4cHJlc3Npb24uYWx0ZXJuYXRlKTtcbiAgICAgICAgcmV0dXJuIGAoJHt0ZXN0fT8ke2NvbnNlcXVlbnR9OiR7YWx0ZXJuYXRlfSlgO1xuICAgIH1cblxuICAgIGNhc2UgJ0FycmF5RXhwcmVzc2lvbic6XG4gICAgICAgIHJldHVybiAnWycgKyBleHByZXNzaW9uLmVsZW1lbnRzLm1hcChjb2RlR2VuKS5qb2luKCcsJykgKyAnXSc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgICB3YXJuKCd1bmV4cGVjdGVkIGV4cHJlc3Npb246Jyk7XG4gICAgICAgIHdhcm4oSlNPTi5zdHJpbmdpZnkoZXhwcmVzc2lvbikpO1xuICAgIH1cbn0iLCJpbXBvcnQge2V2YWxFeHByZXNzaW9uLCBjb2RlR2VufSBmcm9tICcuLi9jb21waWxlci9ldmFsRXhwcmVzc2lvbic7XG5pbXBvcnQge3dhcm4sIGlzRW1wdHksIGdldERpcmVjdGl2ZX0gZnJvbSAnLi4vLi4vc2hhcmVkL2hlbHBlcic7XG5pbXBvcnQge1R5cGVzfSBmcm9tICcuLi8uLi9zaGFyZWQvTm9kZVR5cGVzJztcbmltcG9ydCBFbGVtZW50cyBmcm9tICcuLi8uLi9zaGFyZWQvRWxlbWVudHMnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi4vLi4vc2hhcmVkL0VsZW1lbnQnO1xuaW1wb3J0IFZDb21wb25lbnQgZnJvbSAnLi4vLi4vc2hhcmVkL1ZDb21wb25lbnQnO1xuaW1wb3J0IHtCTE9DS30gZnJvbSAnLi4vLi4vc2hhcmVkL2NvbnN0YW50JztcbmNvbnN0IHtQcm9ncmFtLCBJZiwgRm9yLCBFbGVtZW50OiBFbGVtZW50VHlwZSwgRXhwcmVzc2lvbiwgVGV4dCwgQXR0cmlidXRlLCBJbmNsdWRlfSA9IFR5cGVzO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVZFbGVtZW50KG5vZGUsIHZpZXdDb250ZXh0KSB7XG4gICAgY29uc3Qge3N0YXRlfSA9IHZpZXdDb250ZXh0O1xuICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgY2FzZSBUZXh0OlxuICAgICAgICByZXR1cm4gbm9kZS52YWx1ZTtcblxuICAgIGNhc2UgQXR0cmlidXRlOiB7XG4gICAgICAgIGNvbnN0IHt2YWx1ZX0gPSBub2RlO1xuICAgICAgICBpZiAodmFsdWUudHlwZSA9PT0gRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVFdmFsdXRlZCA9IGV2YWxFeHByZXNzaW9uKHZhbHVlLCB2aWV3Q29udGV4dCk7XG4gICAgICAgICAgICBpZiAodmFsdWVFdmFsdXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBub2RlLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlRXZhbHV0ZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGNhc2UgRWxlbWVudFR5cGU6IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgYXR0cmlidXRlcywgZGlyZWN0aXZlcywgY2hpbGRyZW4sIG5hbWVcbiAgICAgICAgfSA9IG5vZGU7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMsIGRpcmVjdGl2ZXM6IHRoaXNEaXJlY3RpdmVzLCBjb250ZXh0XG4gICAgICAgIH0gPSB2aWV3Q29udGV4dDtcblxuICAgICAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpID09PSBCTE9DSykge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZHcm91cChjaGlsZHJlbiwgdmlld0NvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXR0cmlidXRlTGlzdCA9IGF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IGNyZWF0ZVZFbGVtZW50KGF0dHJpYnV0ZSwgdmlld0NvbnRleHQpKS5maWx0ZXIoaXRlbSA9PiBpdGVtKTtcblxuXG4gICAgICAgIGxldCBsaW5rcyA9IGlzRW1wdHkoZGlyZWN0aXZlcylcbiAgICAgICAgICAgID8ge31cbiAgICAgICAgICAgIDogT2JqZWN0LmtleXMoZGlyZWN0aXZlcykucmVkdWNlKFxuICAgICAgICAgICAgICAgIChwcmV2LCBwYXR0ZXJuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHByZXYsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtwYXR0ZXJuXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGdldERpcmVjdGl2ZShwYXR0ZXJuLCB0aGlzRGlyZWN0aXZlcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IChzdGF0ZSA9IHt9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRpcmVjdGl2ZXNbcGF0dGVybl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUudHlwZSA9PT0gRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmFsRXhwcmVzc2lvbih2YWx1ZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odmlld0NvbnRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkOiBPYmplY3QuYXNzaWduKHt9LCB2aWV3Q29udGV4dC5jb21wdXRlZCwgc3RhdGUpIC8vIG1lcmdlIHN0YXRlIGludG8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7fVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tcG9uZW50cykuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVkNvbXBvbmVudChcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUxpc3QsXG4gICAgICAgICAgICAgICAgdmlld0NvbnRleHQuY29udGV4dCxcbiAgICAgICAgICAgICAgICBjcmVhdGVWR3JvdXAoY2hpbGRyZW4sIHZpZXdDb250ZXh0KSxcbiAgICAgICAgICAgICAgICBsaW5rc1xuICAgICAgICAgICAgKS5zZXRDb25zdHJ1Y3Rvcihjb21wb25lbnRzW25hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBFbGVtZW50LmNyZWF0ZShcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVMaXN0LFxuICAgICAgICAgICAgdmlld0NvbnRleHQuY29udGV4dCxcbiAgICAgICAgICAgIGNyZWF0ZVZHcm91cChjaGlsZHJlbiwgdmlld0NvbnRleHQpLFxuICAgICAgICAgICAgbGlua3NcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjYXNlIElmOiB7XG4gICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgIGlmIChldmFsRXhwcmVzc2lvbihub2RlLnRlc3QsIHZpZXdDb250ZXh0KSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gY3JlYXRlVkVsZW1lbnQobm9kZS5jb25zZXF1ZW50LCB2aWV3Q29udGV4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5hbHRlcm5hdGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNyZWF0ZVZFbGVtZW50KG5vZGUuYWx0ZXJuYXRlLCB2aWV3Q29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjYXNlIEZvcjoge1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IEVsZW1lbnRzLmNyZWF0ZSgpO1xuICAgICAgICBjb25zdCBsaXN0ID0gZXZhbEV4cHJlc3Npb24obm9kZS50ZXN0LCB2aWV3Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IHtpdGVtLCBpbmRleH0gPSBub2RlLmluaXQ7XG4gICAgICAgIGNvbnN0IGl0ZW1OYW1lID0gaXRlbS50eXBlID09PSBFeHByZXNzaW9uID8gY29kZUdlbihpdGVtKTogaXRlbTtcbiAgICAgICAgY29uc3QgaW5kZXhOYW1lID0gaW5kZXgudHlwZSA9PT0gRXhwcmVzc2lvbiA/IGNvZGVHZW4oaW5kZXgpOiBpbmRleDtcbiAgICAgICAgXG4gICAgICAgIGxpc3QuZm9yRWFjaChcbiAgICAgICAgICAgIChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goY3JlYXRlVkVsZW1lbnQobm9kZS5ib2R5LCBPYmplY3QuYXNzaWduKHt9LFxuICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGV4dCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaXRlbU5hbWVdOiAoKSA9PiBldmFsRXhwcmVzc2lvbihub2RlLnRlc3QsIHZpZXdDb250ZXh0KVtpbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2luZGV4TmFtZV06ICgpID0+IGluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xuICAgIH1cblxuICAgIGNhc2UgRXhwcmVzc2lvbjoge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBldmFsRXhwcmVzc2lvbihub2RlLCB2aWV3Q29udGV4dCk7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjYXNlIEluY2x1ZGU6IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZXZhbEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLCB2aWV3Q29udGV4dCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZGVmYXVsdDpcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZHcm91cChub2Rlcywgdmlld0NvbnRleHQpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IEVsZW1lbnRzLmNyZWF0ZSgpO1xuXG4gICAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGNyZWF0ZVZFbGVtZW50KG5vZGUsIHZpZXdDb250ZXh0KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVZET00oYXN0LCB2aWV3Q29udGV4dCkge1xuICAgIC8vIGNyZWF0ZSB2aXJ0dWFsIGRvbVxuICAgIGNvbnN0IHt0eXBlLCBib2R5fSA9IGFzdDtcbiAgICBpZiAodHlwZSA9PT0gUHJvZ3JhbSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlVkdyb3VwKGJvZHksIHZpZXdDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YXJuKCdSb290IGVsZW1lbnQgbXVzdCBiZSBQcm9ncmFtIScpO1xuICAgIH1cbn0iLCJjb25zdCBpbmhlcml0ID0gU3ltYm9sKCdpbmhlcml0Jyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBhbGxJbmhlcml0cyA9IChEYWlzeSkgPT4gRGFpc3lbaW5oZXJpdF07XG5cbmV4cG9ydCBjb25zdCBpbmhlcml0YWJsZSA9IChEYWlzeSkgPT4ge1xuICAgIERhaXN5W2luaGVyaXRdID0gbmV3IE1hcCgpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEluaGVyaXRDYWNoZShjb250ZXh0LCBjYWNoZU5hbWUpIHtcbiAgICBpZiAoIWNvbnRleHRbaW5oZXJpdF0uZ2V0KGNvbnRleHQpKSB7XG4gICAgICAgIGNvbnRleHRbaW5oZXJpdF0uc2V0KGNvbnRleHQsIHt9KTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFudGNlID0gY29udGV4dFtpbmhlcml0XS5nZXQoY29udGV4dCk7XG4gICAgaWYgKCFpbnN0YW50Y2VbY2FjaGVOYW1lXSkge1xuICAgICAgICBpbnN0YW50Y2VbY2FjaGVOYW1lXSA9IFtdO1xuICAgIH1cbiAgICBjb25zdCBjYWNoZSA9IGluc3RhbnRjZVtjYWNoZU5hbWVdO1xuXG4gICAgcmV0dXJuIChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhuYW1lKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FjaGUucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBuYW1lW2l0ZW1dIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWNoZS5wdXNoKHtcbiAgICAgICAgICAgIG5hbWUsIHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9tYWluO1xuXG4vLyBUaGlzIGNvbnN0cnVjdG9yIGlzIHVzZWQgdG8gc3RvcmUgZXZlbnQgaGFuZGxlcnMuIEluc3RhbnRpYXRpbmcgdGhpcyBpc1xuLy8gZmFzdGVyIHRoYW4gZXhwbGljaXRseSBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCB0byBnZXQgYSBcImNsZWFuXCIgZW1wdHlcbi8vIG9iamVjdCAodGVzdGVkIHdpdGggdjggdjQuOSkuXG5mdW5jdGlvbiBFdmVudEhhbmRsZXJzKCkge31cbkV2ZW50SGFuZGxlcnMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICBFdmVudEVtaXR0ZXIuaW5pdC5jYWxsKHRoaXMpO1xufVxuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyO1xuZXhwb3J0IHtFdmVudEVtaXR0ZXJ9O1xuXG4vLyBub2RlanMgb2RkaXR5XG4vLyByZXF1aXJlKCdldmVudHMnKSA9PT0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyXG5cbkV2ZW50RW1pdHRlci51c2luZ0RvbWFpbnMgPSBmYWxzZTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5kb21haW4gPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZG9tYWluID0gbnVsbDtcbiAgaWYgKEV2ZW50RW1pdHRlci51c2luZ0RvbWFpbnMpIHtcbiAgICAvLyBpZiB0aGVyZSBpcyBhbiBhY3RpdmUgZG9tYWluLCB0aGVuIGF0dGFjaCB0byBpdC5cbiAgICBpZiAoZG9tYWluLmFjdGl2ZSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBkb21haW4uRG9tYWluKSkge1xuICAgICAgdGhpcy5kb21haW4gPSBkb21haW4uYWN0aXZlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8IHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRIYW5kbGVycygpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiblwiIGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiAkZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiAkZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuLy8gVGhlc2Ugc3RhbmRhbG9uZSBlbWl0KiBmdW5jdGlvbnMgYXJlIHVzZWQgdG8gb3B0aW1pemUgY2FsbGluZyBvZiBldmVudFxuLy8gaGFuZGxlcnMgZm9yIGZhc3QgY2FzZXMgYmVjYXVzZSBlbWl0KCkgaXRzZWxmIG9mdGVuIGhhcyBhIHZhcmlhYmxlIG51bWJlciBvZlxuLy8gYXJndW1lbnRzIGFuZCBjYW4gYmUgZGVvcHRpbWl6ZWQgYmVjYXVzZSBvZiB0aGF0LiBUaGVzZSBmdW5jdGlvbnMgYWx3YXlzIGhhdmVcbi8vIHRoZSBzYW1lIG51bWJlciBvZiBhcmd1bWVudHMgYW5kIHRodXMgZG8gbm90IGdldCBkZW9wdGltaXplZCwgc28gdGhlIGNvZGVcbi8vIGluc2lkZSB0aGVtIGNhbiBleGVjdXRlIGZhc3Rlci5cbmZ1bmN0aW9uIGVtaXROb25lKGhhbmRsZXIsIGlzRm4sIHNlbGYpIHtcbiAgaWYgKGlzRm4pXG4gICAgaGFuZGxlci5jYWxsKHNlbGYpO1xuICBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgbGlzdGVuZXJzW2ldLmNhbGwoc2VsZik7XG4gIH1cbn1cbmZ1bmN0aW9uIGVtaXRPbmUoaGFuZGxlciwgaXNGbiwgc2VsZiwgYXJnMSkge1xuICBpZiAoaXNGbilcbiAgICBoYW5kbGVyLmNhbGwoc2VsZiwgYXJnMSk7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLCBhcmcxKTtcbiAgfVxufVxuZnVuY3Rpb24gZW1pdFR3byhoYW5kbGVyLCBpc0ZuLCBzZWxmLCBhcmcxLCBhcmcyKSB7XG4gIGlmIChpc0ZuKVxuICAgIGhhbmRsZXIuY2FsbChzZWxmLCBhcmcxLCBhcmcyKTtcbiAgZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIGxpc3RlbmVyc1tpXS5jYWxsKHNlbGYsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5mdW5jdGlvbiBlbWl0VGhyZWUoaGFuZGxlciwgaXNGbiwgc2VsZiwgYXJnMSwgYXJnMiwgYXJnMykge1xuICBpZiAoaXNGbilcbiAgICBoYW5kbGVyLmNhbGwoc2VsZiwgYXJnMSwgYXJnMiwgYXJnMyk7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbWl0TWFueShoYW5kbGVyLCBpc0ZuLCBzZWxmLCBhcmdzKSB7XG4gIGlmIChpc0ZuKVxuICAgIGhhbmRsZXIuYXBwbHkoc2VsZiwgYXJncyk7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBldmVudHMsIGRvbWFpbjtcbiAgdmFyIG5lZWREb21haW5FeGl0ID0gZmFsc2U7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cylcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09IG51bGwpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgZG9tYWluID0gdGhpcy5kb21haW47XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgIGlmIChkb21haW4pIHtcbiAgICAgIGlmICghZXIpXG4gICAgICAgIGVyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50Jyk7XG4gICAgICBlci5kb21haW5FbWl0dGVyID0gdGhpcztcbiAgICAgIGVyLmRvbWFpbiA9IGRvbWFpbjtcbiAgICAgIGVyLmRvbWFpblRocm93biA9IGZhbHNlO1xuICAgICAgZG9tYWluLmVtaXQoJ2Vycm9yJywgZXIpO1xuICAgIH0gZWxzZSBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoIWhhbmRsZXIpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBpc0ZuID0gdHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbic7XG4gIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHN3aXRjaCAobGVuKSB7XG4gICAgLy8gZmFzdCBjYXNlc1xuICAgIGNhc2UgMTpcbiAgICAgIGVtaXROb25lKGhhbmRsZXIsIGlzRm4sIHRoaXMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgZW1pdE9uZShoYW5kbGVyLCBpc0ZuLCB0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzOlxuICAgICAgZW1pdFR3byhoYW5kbGVyLCBpc0ZuLCB0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDQ6XG4gICAgICBlbWl0VGhyZWUoaGFuZGxlciwgaXNGbiwgdGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSk7XG4gICAgICBicmVhaztcbiAgICAvLyBzbG93ZXJcbiAgICBkZWZhdWx0OlxuICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICBlbWl0TWFueShoYW5kbGVyLCBpc0ZuLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIGlmIChuZWVkRG9tYWluRXhpdClcbiAgICBkb21haW4uZXhpdCgpO1xuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKCFldmVudHMpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IG5ldyBFdmVudEhhbmRsZXJzKCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmICghZXhpc3RpbmcpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID0gcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgICBpZiAocHJlcGVuZCkge1xuICAgICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIG0gPSAkZ2V0TWF4TGlzdGVuZXJzKHRhcmdldCk7XG4gICAgICBpZiAobSAmJiBtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtKSB7XG4gICAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAgIHZhciB3ID0gbmV3IEVycm9yKCdQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIHR5cGUgKyAnIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0Jyk7XG4gICAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICAgIHcudHlwZSA9IHR5cGU7XG4gICAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICAgIGVtaXRXYXJuaW5nKHcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBlbWl0V2FybmluZyhlKSB7XG4gIHR5cGVvZiBjb25zb2xlLndhcm4gPT09ICdmdW5jdGlvbicgPyBjb25zb2xlLndhcm4oZSkgOiBjb25zb2xlLmxvZyhlKTtcbn1cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfTtcblxuZnVuY3Rpb24gX29uY2VXcmFwKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGZpcmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRhcmdldCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICByZXR1cm4gZztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgIHRoaXMucHJlcGVuZExpc3RlbmVyKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbGlzdCwgZXZlbnRzLCBwb3NpdGlvbiwgaSwgb3JpZ2luYWxMaXN0ZW5lcjtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoIWV2ZW50cylcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGxpc3QgPSBldmVudHNbdHlwZV07XG4gICAgICBpZiAoIWxpc3QpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgKGxpc3QubGlzdGVuZXIgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0Lmxpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwb3NpdGlvbiA9IC0xO1xuXG4gICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsTGlzdGVuZXIgPSBsaXN0W2ldLmxpc3RlbmVyO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBsaXN0WzBdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRIYW5kbGVycygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBvcmlnaW5hbExpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHM7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmICghZXZlbnRzKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICAgICAgaWYgKCFldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRIYW5kbGVycygpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0pIHtcbiAgICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBrZXk7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRIYW5kbGVycygpO1xuICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gICAgICAgIH0gd2hpbGUgKGxpc3RlbmVyc1swXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgdmFyIGV2bGlzdGVuZXI7XG4gIHZhciByZXQ7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKCFldmVudHMpXG4gICAgcmV0ID0gW107XG4gIGVsc2Uge1xuICAgIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gICAgaWYgKCFldmxpc3RlbmVyKVxuICAgICAgcmV0ID0gW107XG4gICAgZWxzZSBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXQgPSBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXTtcbiAgICBlbHNlXG4gICAgICByZXQgPSB1bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBsaXN0ZW5lckNvdW50O1xuZnVuY3Rpb24gbGlzdGVuZXJDb3VudCh0eXBlKSB7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3Qub3duS2V5cyh0aGlzLl9ldmVudHMpIDogW107XG59O1xuXG4vLyBBYm91dCAxLjV4IGZhc3RlciB0aGFuIHRoZSB0d28tYXJnIHZlcnNpb24gb2YgQXJyYXkjc3BsaWNlKCkuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICh2YXIgaSA9IGluZGV4LCBrID0gaSArIDEsIG4gPSBsaXN0Lmxlbmd0aDsgayA8IG47IGkgKz0gMSwgayArPSAxKVxuICAgIGxpc3RbaV0gPSBsaXN0W2tdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgaSkge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cbiIsImltcG9ydCBMZXhlciBmcm9tICcuLi9jb3JlL3BhcnNlci9MZXhlcic7XG5pbXBvcnQgUGFyc2VyIGZyb20gJy4uL2NvcmUvcGFyc2VyL1BhcnNlcic7XG5pbXBvcnQgcGF0Y2ggZnJvbSAnLi9yZW5kZXJlcnMvcGF0Y2gnO1xuaW1wb3J0IGRpcmVjdGl2ZXMgZnJvbSAnLi4vZXh0ZW5zaW9ucy9kaXJlY3RpdmVzJztcbmltcG9ydCBldmVudHMgZnJvbSAnLi4vZXh0ZW5zaW9ucy9ldmVudHMnO1xuXG5pbXBvcnQgZGlmZlZET00gZnJvbSAnLi4vY29yZS92ZG9tL2RpZmYnO1xuaW1wb3J0IGNyZWF0ZVZET00gZnJvbSAnLi4vY29yZS92ZG9tL2NyZWF0ZSc7XG5pbXBvcnQge2NyZWF0ZUVsZW1lbnRzfSBmcm9tICcuL3JlbmRlcmVycy9jcmVhdGVFbGVtZW50JztcbmltcG9ydCB7bm9vcCwgbWl4aW4sIGNyZWF0ZURpcmVjdGl2ZSwgY3JlYXRlRXZlbnQsIGdldFByb3BwZXJ0eU9iamVjdCwgZ2V0Um9vdEVsZW1lbnR9IGZyb20gJy4uL3NoYXJlZC9oZWxwZXInO1xuaW1wb3J0IHthbGxJbmhlcml0cywgaW5oZXJpdGFibGUsIHNldEluaGVyaXRDYWNoZX0gZnJvbSAnLi4vY29yZS9pbmhlcml0JztcbmltcG9ydCBFdmVudHMgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7U1RBVEUsIE1FVEhPRFMsIERJUkVDVElWRVMsIENPTVBPTkVOVFMsIEVWRU5UUywgQVNULCBWRE9NLCBSRE9NLCBFVkVOVCwgQ09NUFVURUR9IGZyb20gJy4uL3NoYXJlZC9jb25zdGFudCc7XG5cbmNsYXNzIERhaXN5IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBzdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGJvZHksXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIHJlbmRlciA9IHRoaXMucmVuZGVyXG4gICAgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29tcG9zZSh7c3RhdGUsIGJvZHksIGNvbnRleHR9KTtcblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHJlbmRlcigpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzW0FTVF0gPSBQYXJzZXIodGVtcGxhdGUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGluIFBhcnNlcjogXFxuXFx0JyArIGUuc3RhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wYXJzZWQodGhpc1tBU1RdKTtcblxuICAgICAgICB0aGlzLnJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICBbTUVUSE9EU106IG1ldGhvZHMsXG4gICAgICAgICAgICAgICAgW1NUQVRFXTogc3RhdGUsXG4gICAgICAgICAgICAgICAgW0RJUkVDVElWRVNdOiBkaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgIFtDT01QT05FTlRTXTogY29tcG9uZW50cyxcbiAgICAgICAgICAgICAgICBbQ09NUFVURURdOiBjb21wdXRlZCxcbiAgICAgICAgICAgICAgICBib2R5XG4gICAgICAgICAgICB9ID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZET00odGhpc1tBU1RdLCB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cywgZGlyZWN0aXZlcywgc3RhdGUsIG1ldGhvZHMsIGNvbnRleHQ6IHRoaXMsIGJvZHksIGNvbXB1dGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzW1ZET01dID0gdGhpcy5yZW5kZXIoKTtcblxuICAgICAgICB0aGlzW0VWRU5UU10uZm9yRWFjaCgoe25hbWUsIGhhbmRsZXJ9KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uKG5hbWUsIGhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVhZHkodGhpc1tWRE9NXSk7XG4gICAgfVxuXG4gICAgY29tcG9zZSh7XG4gICAgICAgIHN0YXRlID0ge30sXG4gICAgICAgIGJvZHkgPSBbXSxcbiAgICAgICAgY29udGV4dFxuICAgIH0pIHtcbiAgICAgICAgdGhpc1tTVEFURV0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlKCksIHN0YXRlKTtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpc1tFVkVOVF0gPSBuZXcgRXZlbnRzKCk7XG5cbiAgICAgICAgdGhpc1tNRVRIT0RTXSA9IHt9O1xuICAgICAgICB0aGlzW0RJUkVDVElWRVNdID0gW107XG4gICAgICAgIHRoaXNbQ09NUE9ORU5UU10gPSB7fTtcbiAgICAgICAgdGhpc1tFVkVOVFNdID0gW107XG4gICAgICAgIHRoaXNbQ09NUFVURURdID0gW107XG4gICAgICAgIHRoaXMucmVmcyA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IFtDb21wb25ldCwge1xuICAgICAgICAgICAgW01FVEhPRFNdOiBtZXRob2RzID0gW10sXG4gICAgICAgICAgICBbRElSRUNUSVZFU106IGRpcmVjdGl2ZXMgPSBbXSxcbiAgICAgICAgICAgIFtDT01QT05FTlRTXTogY29tcG9uZW50cyA9IFtdLFxuICAgICAgICAgICAgW0NPTVBVVEVEXTogY29tcHV0ZWQgPSBbXSxcbiAgICAgICAgICAgIFtFVkVOVFNdOiBldmVudHMgPSBbXVxuICAgICAgICB9XSBvZiBhbGxJbmhlcml0cyh0aGlzLmNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBDb21wb25ldCkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpc1tNRVRIT0RTXSwgZ2V0UHJvcHBlcnR5T2JqZWN0KG1ldGhvZHMpKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXNbQ09NUE9ORU5UU10sIGdldFByb3BwZXJ0eU9iamVjdChjb21wb25lbnRzKSk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzW0NPTVBVVEVEXSwgZ2V0UHJvcHBlcnR5T2JqZWN0KGNvbXB1dGVkKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW0RJUkVDVElWRVNdID0gW1xuICAgICAgICAgICAgICAgICAgICAuLi50aGlzW0RJUkVDVElWRVNdLCAuLi5kaXJlY3RpdmVzLm1hcCgoaXRlbSkgPT4gY3JlYXRlRGlyZWN0aXZlKGl0ZW0pKVxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICB0aGlzW0VWRU5UU10gPSBbXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXNbRVZFTlRTXSwgXG4gICAgICAgICAgICAgICAgICAgIC4uLihldmVudHMubWFwKGl0ZW0gPT4gY3JlYXRlRXZlbnQoaXRlbSkpKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbU1RBVEVdO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucmVuZGVyID0gKCkgPT4gW107IC8vIHJlbmRlciBjYW4gY3JlYXRlIHZET01cbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzW1NUQVRFXSA9IHt9O1xuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIG1vdW50KG5vZGUpIHtcbiAgICAgICAgY3JlYXRlRWxlbWVudHModGhpc1tWRE9NXSwgbm9kZSwgdGhpcyk7XG4gICAgICAgIHRoaXNbUkRPTV0gPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgIHRoaXMubW91bnRlZCh0aGlzW1JET01dKTsgIC8vIHZET00sIHJlYWxET01cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICBpZiAoc3RhdGUgPT09IHRoaXNbU1RBVEVdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzW1NUQVRFXSA9IE9iamVjdC5hc3NpZ24odGhpc1tTVEFURV0sIHN0YXRlKTsgLy8gQHRvZG8gY2xvbmUgc3RhdGVcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpZiA9IGdldFJvb3RFbGVtZW50KHRoaXMpLnBhdGNoRGlmZigpO1xuXG4gICAgICAgIHRoaXMucGF0Y2hlZChkaWYpO1xuICAgIH1cblxuICAgIHBhdGNoRGlmZigpIHtcbiAgICAgICAgY29uc3Qge1tWRE9NXTogbGFzdFZET019ID0gdGhpcztcblxuICAgICAgICB0aGlzW1ZET01dID0gdGhpcy5yZW5kZXIoKTtcblxuICAgICAgICBjb25zdCBkaWYgPSBkaWZmVkRPTShsYXN0VkRPTSwgdGhpc1tWRE9NXSk7XG5cbiAgICAgICAgcGF0Y2godGhpc1tSRE9NXSwgZGlmKTtcblxuICAgICAgICByZXR1cm4gZGlmO1xuICAgIH1cbn1cblxuaW5oZXJpdGFibGUoRGFpc3kpO1xuXG5EYWlzeS5kaXJlY3RpdmUgPSBzZXRJbmhlcml0Q2FjaGUoRGFpc3ksIERJUkVDVElWRVMpO1xuRGFpc3kuY29tcG9uZW50ID0gc2V0SW5oZXJpdENhY2hlKERhaXN5LCBDT01QT05FTlRTKTtcbkRhaXN5Lm1ldGhvZCA9IHNldEluaGVyaXRDYWNoZShEYWlzeSwgTUVUSE9EUyk7XG5EYWlzeS5ldmVudCA9IHNldEluaGVyaXRDYWNoZShEYWlzeSwgRVZFTlRTKTtcbkRhaXN5LmNvbXB1dGVkID0gc2V0SW5oZXJpdENhY2hlKERhaXN5LCBDT01QVVRFRCk7XG5cbm1peGluKERhaXN5LCBldmVudHMpO1xuXG5jb25zdCBob29rcyA9IHtcbiAgICBwYXJzZWQ6IG5vb3AsIHJlYWR5OiBub29wLCBtb3VudGVkOiBub29wLCBwYXRjaGVkOiBub29wXG59O1xuXG5taXhpbihEYWlzeSwgaG9va3MpOyAvLyBob29rXG5cbkRhaXN5LmRpcmVjdGl2ZShkaXJlY3RpdmVzKTtcblxuRGFpc3kudmVyaXNvbiA9ICcxLjAuMCc7XG5cbkRhaXN5LkxleGVyID0gTGV4ZXI7XG5cbkRhaXN5LlBhcnNlciA9IFBhcnNlcjtcblxuZXhwb3J0IGRlZmF1bHQgRGFpc3k7Il0sIm5hbWVzIjpbInRoaXMiLCJwYXJzZSIsImlzU2VsZkNsb3NlIiwiRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJFbGVtZW50IiwiVEVYVCIsImRpZmZWRWxlbWVudCIsIlByb2dyYW0iLCJJZiIsIkZvciIsIlRleHQiLCJBdHRyaWJ1dGUiLCJJbmNsdWRlIiwiZGlyZWN0aXZlcyIsIkV2ZW50cyIsImV2ZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR08sTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLEFBQU8sTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDO0FBQ3JDLEFBQU8sTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLEFBQU8sTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLEFBQXlCO0FBQ3pCLEFBQU8sTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQzNCLEFBQU8sTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQzNCLEFBQU8sTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQzNCLEFBQTZCO0FBQzdCLEFBQU8sTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQzdCLEFBQU8sTUFBTSxH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
