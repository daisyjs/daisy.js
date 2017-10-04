import {
    Element, Elements
} from './Element';

function createRTree(elements) {
    const fragment = document.createDocumentFragment();
    
    elements.forEach(
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

        setProps(node, props);

        return node;
    } else if (element instanceof Elements) {
        return createRTree(element);
    }

    return document.createTextNode(element);
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

export {
    createRTree, createRElement,
    setProps, setStyle
};
