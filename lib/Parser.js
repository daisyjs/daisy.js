const {Lexer} = require('./Lexer');
const {INIT, OPEN_TAG, CLOSE_TAG, END_TAG, COMMENT, TAGNAME, TAG, EXPR, TEXT, ATTR, EQUAL, VALUE, EOF} = require('./StateTypes');
const {Program, If, For, Element, Comment, Attribute, Expression, Text, Types} = require('./NodeTypes');
const {Expression: expression} = require('./Expression');
const {isIncludeExpr} = require('./helper');

const IF_ATTR = 'd:if';
const ELSE_ATTR = 'd:else';
const ELSE_IF_ATTR = 'd:elif';
const FOR_ATTR = 'd:for';
const FOR_ITEM_ATTR = 'd:for-item';
const FOR_ITEM_INDEX_ATTR = 'd:for-index';

function Parser(source) {
    const tokens = Lexer(source);
    const {code, message} = isTagClosed(tokens);
    if (code !== 0) {
        throw message;
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
        return package(type => type !== END_TAG && type !== EOF);
    }

    function package(condition) {
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

        let children, directives;
        let attrNodes = attrs();

        const refs = regenerateAttrs(attrNodes);
        attrNodes = refs.attrs;
        directives = refs.directives;

        if (!isSelfClose(token)) {
            children = program();
        }

        let element = Element(
            content, attrNodes, children
        );

        const ifNodeList = nodes.filter(({type}) => {
            return type === Types.If;
        });

        const lastIfNode = ifNodeList[ifNodeList.length - 1];

        element = wrapElseStatement(element, directives, lastIfNode);

        element = wrapIfStatement(element, directives);

        element = wrapForStatement(element, directives);

        comsume(END_TAG);

        return element;
    }

    function wrapElseStatement (element, directives, lastIfNode) {
        let elseIfValue = directives[ELSE_IF_ATTR];

        const keys = Object.keys(directives);
 
        if (lastIfNode) {
            // find the empty alternate
            while (lastIfNode.alternate) {
                lastIfNode = lastIfNode.alternate;
            }
    
            if (keys.includes(ELSE_ATTR)) {
                lastIfNode.alternate = element;
                return null;
            } else if (elseIfValue) {
                lastIfNode.alternate = If(elseIfValue, element);
                return null;
            }    
        }

        return element;
    }

    function wrapIfStatement(element, directives) {
        let value = directives[IF_ATTR];
        if (value) {
            return If(value, element);
        }
        return element;
    }

    function wrapForStatement(element, directives) {
        let value = directives[FOR_ATTR];
        if (value) {
            return For(value, {
                item: directives[FOR_ITEM_ATTR],
                index: directives[FOR_ITEM_INDEX_ATTR],
            }, element);
        }
        return element;
    }

    function regenerateAttrs(attrNodes) {
        const attrs = [];
        const directives = {};

        for (let attr of attrNodes) {
            let {name, value = ''} = attr;
            if (isIncludeExpr(value)) {
                value = Expression(expression(value));
            }

            if (name.includes('d:')) {
                Object.assign(directives, ({
                    [name]: value
                }));
            } else {
                attrs.push(Object.assign({}, attr, {
                    value
                }));
            }
        }

        return {
            attrs, directives
        };
    }

    function expr() {
        const expr = ll();
        next();
        return Expression(expression(expr.content));
    }

    function attrs() {
        const attrs = [];
        while (la() === ATTR) {
            const name = ll().content;
            next();
            const value = comsume(VALUE).content;
            
            const attr = Attribute(name, value);
            attrs.push(attr);
        }
        return attrs;
    }

    function next() {
        pos ++;
    }

    function comsume(type) {
        let matched = {};
        if (la() === type) {
            matched = ll();
            next();
        }
        return matched;
    }
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
            const {line, column} = stackTop;
            if (stackTop.content === content) {
                stack.pop();
            } else {
                return {
                    code: -1,
                    message: `Unclosed tag <${stackTop.content}>: \nline - ${line}, column - ${column}`
                };
            }
        }
        i ++;
    }

    if (stack.length !== 0) {
        const stackTop = stack[stack.length - 1];
        const {line, column} = stackTop;
        
        return {
            code: -1,
            message: `Unclosed tag <${stackTop.content}>: \nline - ${line}, column - ${column}`
        };
    }

    return {code: 0};
}

const voidTagTypes = splitSpace('area base br col embed hr img input keygen link menuitem meta param source track wbr r-content');
function isVoidTag(tag) {
    return voidTagTypes.includes(tag);
}

function isSelfClose({type, isSelfClose}) {
    return type === TAGNAME && isSelfClose;
}

function splitSpace(str) {
    return str.split(' ');
}

exports.Parser = Parser;