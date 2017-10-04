import {
    Types
} from './NodeTypes';
import {EvalExpression, codeGen} from './EvalExpression';
import {Element, Elements} from './Element';
import {createRElement, setProps, setStyle} from './RTree';
import {warn, isEmpty} from './helper';
import diff from './diff';

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
        const styleDiff = diff(element1.props.style, element2.props.style);

        if (!isEmpty(styleDiff)) {
            return {
                type: STYLE,
                changed: styleDiff
            };
        }
    }

    function diffProps() {
        const propsDiff = diff(element1.props, element2.props);

        if (!isEmpty(propsDiff)) {
            return {
                type: PROPS,
                changed: propsDiff
            };
        }
    }

    function diffTagName() {
        if (element1.tagName !== element2.tagName) {
            return {
                type: REPLACE,
                changed: element2
            };
        }
    }

    if (typeof element1 !== typeof element2) {
        return [{
            type: REPLACE,
            chaneged: element2
        }];
    }

    if (
        typeof element1 === 'string' &&
        typeof element2 === 'string'
    ) {
        if (element1 !== element2) {
            return [{
                type: TEXT,
                changed: element2
            }];
        }
        return [];
    }

    const changes = [];
    return [diffStyle, diffProps, diffTagName].reduce((prev, item) => {
        const result = item();
        if (result) {
            prev.push(result);
        }
        return prev;
    }, changes);
}

function walkVTree(lastTree = [], nextTree = [], fn, index = -1) {
    function hasChild(element) {
        return (element instanceof Element && element.children.length > 0);
    }

    lastTree.forEach((lastTreeLeaf, leafIndex) => {
        const nextTreeLeaf = nextTree[leafIndex];
        fn(lastTreeLeaf, nextTreeLeaf, ++index);

        if (hasChild(lastTreeLeaf)) {
            const nextTreeLeafChildren = hasChild(nextTreeLeaf) ? nextTreeLeaf.children : [];
            index = walkVTree(lastTreeLeaf.children, nextTreeLeafChildren, fn, index);
        }
    });

    if (nextTree.length > lastTree.length) {
        nextTree.slice(lastTree.length).forEach(
            (nextTreeLeaf) =>
                fn(null, nextTreeLeaf, index)
        );
    }

    return index;
}

function walkRTree(tree, fn, index = -1) {
    tree.forEach(item => {
        fn(item, ++index);
        if (item.childNodes.length > 0) {
            index = walkRTree(item.childNodes, fn, index);
        }
    });
    return index;
}

function diffVTree(lastVTree, nextVTree) {
    const patches = {};

    walkVTree(lastVTree, nextVTree, (lastTreeLeaf, nextTreeLeaf, index) => {
        if (void 0 === patches[index]) {
            patches[index] = [];
        }

        if (!lastTreeLeaf) {
            patches[index].push({
                type: NEW,
                changed: nextTreeLeaf
            });
            return;
        }

        if (!nextTreeLeaf) {
            patches[index].push({
                type: REMOVE
            });
            return;
        }

        patches[index] = patches[index].concat(
            diffVElement(lastTreeLeaf, nextTreeLeaf)
        );
    });

    return patches; // difference set
}

function patch(rTree, patches) {
    function patchElement(node, parent, nextElement) {
        return (currentPatch) => {
            const {type, changed} = currentPatch;
            switch (type) {
            case STYLE:
                setStyle(node.style, changed);
                break;

            case PROPS:
                setProps(node, changed);
                break;

            case TEXT:
                node[node.textContent ? 'textContent' : 'nodeValue'] = changed; // fuck ie
                break;

            case NEW:
                parent.insertBefore(createRElement(changed), nextElement);
                break;

            case REPLACE:
                parent.replaceChild(createRElement(changed), node);
                break;

            case REMOVE:
                parent.removeChild(node);
                break;
            default:
            }
        };
    }

    const list = [];

    walkRTree(rTree, (node, index) => {
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
            // eslint-disable-next-line
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
