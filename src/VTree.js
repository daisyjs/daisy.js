import {
    Types
} from './NodeTypes';
import {EvalExpression, codeGen} from './EvalExpression';
import {Element, Elements} from './Element';
import {createRElement} from './RTree';
import {warn, diffObject} from './helper';

const {
    Program, If, For, Element: ElementType, Expression, Text, Attribute
} = Types;

const TEXT = 'text';
const STYLE = 'style';
const PROPS = 'props';
const REPLACE = 'replace';
const REMOVE = 'remove';
const NEW = 'new';
const BLOCK = 'block';

function diffVElement(element1 = {}, element2 = {}) {
    function diffStyle() {
        const styleDiff = diffObject(element1.props.style, element2.props.style);

        if (styleDiff) {
            return {
                type: STYLE,
            };
        }
    }

    function diffProps() {
        const propsDiff = diffObject(element1.props, element2.props);

        if (propsDiff) {
            return {
                type: PROPS,
            };
        }
    }

    function diffTagName() {
        if (element1.tagName !== element2.tagName) {
            return {
                type: REPLACE
            };
        }
    }

    if (
        typeof element1 === 'string' &&
        typeof element2 === 'string'
    ) {
        if (element1 !== element2) {
            return {
                type: TEXT,
            };
        }
        return;
    }

    return diffTagName() || diffStyle () || diffProps() ;
}

function dfsVtree(lastTree = [], nextTree = [], fn, index = -1) {
    lastTree.forEach((lastTreeNode, nodeIndex) => {
        const nextTreeNode = nextTree[nodeIndex];
        fn(lastTreeNode, nextTreeNode, ++index);

        if (
            (lastTreeNode instanceof Element && lastTreeNode.children.length > 0)
        ) {
            const nextTreeNodeChildren =
                (nextTreeNode instanceof Element && nextTreeNode.children.length > 0)
                ? nextTreeNode.children
                : [];
            index = dfsVtree(lastTreeNode.children, nextTreeNodeChildren, fn, index);
        }
    });

    if (nextTree.length > lastTree.length) {
        nextTree.slice(lastTree.length).forEach(
            (nextTreeNode) =>
                fn(null, nextTreeNode, index)
        )
    }

    return index;
}

function dfsRTree(tree, fn, index = -1) {
    tree.forEach(item => {
        fn(item, ++index);
        if (item.childNodes.length > 0) {
            index = dfsRTree(item.childNodes, fn, index);
        }
    });
    return index;
}

function diffVTree(lastVTree, nextVTree) {
    const patches = {};

    dfsVtree(lastVTree, nextVTree, (lastTreeNode, nextTreeNode, index) => {

        if (void 0 === patches[index]) {
            patches[index] = [];
        }

        if (!lastTreeNode) {
            patches[index].push({
                type: NEW,
                element: nextTreeNode
            })
            return;
        }

        if (!nextTreeNode) {
            patches[index].push({
                type: REMOVE
            })
            return;
        }

        const {type} = diffVElement(lastTreeNode, nextTreeNode) || {};
        if (type) {
            console.log(type);
            patches[index].push({
                type: REPLACE,
                element: nextTreeNode
            })
        }
    });

    return patches; // difference set
}

function patch(rTree, patches) {
    function patchElement(node, parent) {
        return (currentPatch) => {
            const {type, element} = currentPatch;
            switch (type) {
                case NEW:
                    if (parent) {
                        parent.insertBefore(createRElement(element), node.nextSibling);
                    }
                    break;

                case REPLACE:
                    if (parent) {
                        parent.replaceChild(createRElement(element), node)
                    }
                    break;

                case REMOVE:
                    parent.removeChild(node);
                default:
            }
        }
    }

    const list = [];

    dfsRTree(rTree, (node, index) => {
        list[index] = node;
    });

    // walk the difference set and update
    list.forEach((node, index) => {
        if (patches[index].length > 0) {
            patches[index].forEach(
                patchElement(node, node.parentNode)
            );
        }
    });

    list.length = 0; // gc
}

function createVElement(node, viewContext) {
    const {state, methods} = viewContext;
    switch (node.type) {
    case Text:
        return node.value;

    case Attribute: {
        const {value} = node;
        if (value.type === Expression) {
            const valueEvaluted = EvalExpression(value, viewContext);
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

        if (name.toLowerCase() === BLOCK) {
            return createVGroup(children, viewContext);
        }

        return Element.create(
            node.name,
            attributes.map((attribute) => createVElement(attribute, viewContext)).filter(item => item),
            createVGroup(children, viewContext)
        );
    }

    case If: {
        let result;
        if (EvalExpression(node.test, viewContext)) {
            result = createVElement(node.consequent, viewContext);
        } else if (node.alternate) {
            result = createVElement(node.alternate, viewContext);
        }
        return result;
    }

    case For: {
        const elements = Elements.create();
        const list = EvalExpression(node.test, viewContext);
        const {item, index} = node.init;
        const itemName = codeGen(item);
        const indexName = codeGen(index);

        list.forEach(
            (item, index) => {
                elements.push(createVElement(node.body, {
                    state: Object.assign({}, state, {
                        [itemName]: item,
                        [indexName]: index
                    }),
                    methods
                }));
            }
        );

        return elements;
    }

    case Expression: {
        const result = EvalExpression(node, viewContext);
        if (typeof result !== 'string') {
            return JSON.stringify(result, null, 4);
        }
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

function createVTree(ast, viewContext) {
    // create virtual dom
    const {type, body} = ast;
    if (type === Program) {
        return createVGroup(body, viewContext);
    } else {
        warn('Root element must be Program!');
    }
}

export {
    createVTree,
    diffVTree,
    patch
};
