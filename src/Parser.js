import {Lexer} from './Lexer';
import {END_TAG, COMMENT, TAGNAME, CLOSE_TAG, EXPR, TEXT, ATTR, VALUE, EOF} from'./StateTypes';
import {Program, If, For, Element, Comment, Attribute, Expression, Text, Types} from'./NodeTypes';
import {Expression as expression, isIncludeExpr} from'./Expression';
import {isSelfClose, error, isVoidTag} from'./helper';

const STATEMENT_MARK = ':';
const DIRECTIVE_MARK = '@';
const IF_DIRECTIVE = `${STATEMENT_MARK}if`;
const ELSE_DIRECTIVE = `${STATEMENT_MARK}else`;
const ELSE_IF_DIRECTIVE = `${STATEMENT_MARK}elif`;
const FOR_DIRECTIVE = `${STATEMENT_MARK}for`;
const FOR_ITEM_DIRECTIVE = `${STATEMENT_MARK}for-item`;
const FOR_ITEM_INDEX_DIRECTIVE = `${STATEMENT_MARK}for-index`;

function Parser(source) {
    let tokens;

    try {
        tokens = Lexer(source);
    } catch (e) {
        return error('Error in Lexer: \n' + e.stack);
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

        const lastIfNode = ifNodeList[ifNodeList.length - 1];

        element = wrapForStatement(element, statements);

        element = wrapElseStatement(element, statements, lastIfNode);

        if (element) {
            element = wrapIfStatement(element, statements);
        } else {
            nodes.splice(nodes.indexOf(lastIfNode) + 1);
        }

        consume(END_TAG);

        return element;
    }

    function wrapElseStatement (element, statements, lastIfNode) {
        let elseIfValue = statements[ELSE_IF_DIRECTIVE];

        const keys = Object.keys(statements);

        if (lastIfNode) {
            // find the empty alternate
            while (lastIfNode.alternate) {
                lastIfNode = lastIfNode.alternate;
            }

            if (keys.includes(ELSE_DIRECTIVE)) {
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
        let value = statements[IF_DIRECTIVE];
        if (value) {
            return If(value, element);
        }
        return element;
    }

    function wrapForStatement(element, statements) {
        let value = statements[FOR_DIRECTIVE];
        if (value) {
            return For(value, {
                item: statements[FOR_ITEM_DIRECTIVE],
                index: statements[FOR_ITEM_INDEX_DIRECTIVE],
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
                value = Expression(expression(value));
            }

            if (name.startsWith(STATEMENT_MARK)) {
                Object.assign(statements, ({
                    [name]: value
                }));
            } else if (name.startsWith(DIRECTIVE_MARK)) {
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
            attrs, statements, directives
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
            let value = consume(VALUE).content;

            if (!value) {
                value = Expression(expression(consume(EXPR).content));
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


export {Parser};
