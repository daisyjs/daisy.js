import {evalExpression, codeGen} from '../compiler/evalExpression';
import {warn, isEmpty, getDirective} from '../../shared/helper';
import {Types} from '../../shared/NodeTypes';
import Elements from '../../shared/Elements';
import Element from '../../shared/Element';
import VComponent from '../../shared/VComponent';
import {BLOCK} from '../../shared/constant';
const {Program, If, For, Element: ElementType, Expression, Text, Attribute, Include} = Types;


function createVElement(node, viewContext) {
    const {state} = viewContext;
    switch (node.type) {
    case Text:
        return node.value;

    case Attribute: {
        const {value} = node;
        if (value.type === Expression) {
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
                                    if (value.type === Expression) {
                                        return evalExpression(value, 
                                            Object.assign(viewContext, {
                                                state: Object.assign({}, viewContext.state, state) // merge state into 
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

        return Element.create(
            name,
            attributeList,
            viewContext.context,
            createVGroup(children, viewContext),
            links
        );
    }

    case If: {
        let result;
        if (evalExpression(node.test, viewContext)) {
            result = createVElement(node.consequent, viewContext);
        } else if (node.alternate) {
            result = createVElement(node.alternate, viewContext);
        }
        return result;
    }

    case For: {
        const elements = Elements.create();
        const list = evalExpression(node.test, viewContext);
        const {item, index} = node.init;
        const itemName = codeGen(item);
        const indexName = codeGen(index);

        list.forEach(
            (item, index) => {
                elements.push(createVElement(node.body, Object.assign({},
                    viewContext, {
                        state: Object.assign({}, state, {
                            [itemName]: item,
                            [indexName]: index
                        })
                    }
                )));
            }
        );

        return elements;
    }

    case Expression: {
        const result = evalExpression(node, viewContext);
        if (typeof result !== 'string') {
            return JSON.stringify(result, null, 4);
        }
        return result;
    }

    case Include: {
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

export default function createVDOM(ast, viewContext) {
    // create virtual dom
    const {type, body} = ast;
    if (type === Program) {
        return createVGroup(body, viewContext);
    } else {
        warn('Root element must be Program!');
    }
}