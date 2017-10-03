import Element from './Element';

function createRTree(nodes) {
    const fragment = document.createDocumentFragment();
    const viewItems = nodes.forEach(
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
    }

    return document.createTextNode(element);
}

export {
    createRTree
}
