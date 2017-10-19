import {evalExpression, codeGen} from '../compiler/evalExpression';
import {warn, isEmpty, getDirective} from '../../shared/helper';
import {Types} from '../../shared/NodeTypes';
import Elements from '../../shared/Elements';
import Element from '../../shared/Element';
import {BLOCK, VDOM, STATE} from '../../shared/constant';
import {getProppertyObject} from '../../shared/helper';
import link from '../../shared/link';

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

        let _directives = isEmpty(directives)
            ? {}
            : Object.keys(directives).reduce(
                (prev, pattern) => {
                    const binding = {
                        name: pattern,
                        state,
                        value: (state = {}) => {
                            const value = directives[pattern];
                            if (value.type === Expression) {
                                return evalExpression(value, 
                                    Object.assign({}, viewContext, {
                                        context: links.context,
                                        state: links.context[STATE],
                                        computed: Object.assign(
                                            {}, 
                                            viewContext.computed,
                                            state
                                        ) // merge state into 
                                    }));
                            }
                            return value;
                        }
                    };

                    return Object.assign(prev, {
                        [pattern]: {
                            link: getDirective(pattern, thisDirectives),
                            binding
                        }
                    });
                },
                {}
            );

        const links = {
            context,
            directives: _directives
        };

        if (Object.keys(components).includes(name)) {
            const Component = components[name];
            
            const componentInstance = new Component({
                body: createVGroup(children, viewContext),
                props: getProppertyObject(attributeList),
                computed: viewContext.computed,
                context: viewContext.context
            });


            let element;

            element = Element.create(
                'daisy-component',
                [],
                componentInstance,
                componentInstance[VDOM],
                links,
                componentInstance
            );

            link(componentInstance, element);
            
            return element;
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
        const itemName = item.type === Expression ? codeGen(item): item;
        const indexName = index.type === Expression ? codeGen(index): index;

        list.forEach(
            (item, index) => {
                const withComputed = Object.assign({},
                    viewContext, {
                        computed: {
                            [itemName]: () => item,
                            [indexName]: () => index
                        }
                    }
                );
                const element = createVElement(node.body, withComputed);
                elements.append(element);
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
        const vNode = createVElement(node, viewContext);
        elements.append(vNode);
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