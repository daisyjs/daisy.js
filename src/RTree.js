import {
    Element, Elements
} from './Element';

function createRTree(group) {
    const fragment = document.createDocumentFragment();
    const viewItems = group.getElements().forEach(
        node =>
            fragment.appendChild(createRElement(node))
    );

    return fragment;
}

function createRElement(element) {
    if (element instanceof Element) {
        const {props, tagName, children} = element;
        const node = document.createElement(tagName);

        node.appendChild(
            createRTree(children)
        );

        props.forEach(({name, value}) => {
            node.setAttribute(name, value);
        });

        return node;
    } else if (element instanceof Elements) {
        return createRTree(element);
    }

    return document.createTextNode(element);
}

export {
    createRTree
}
