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
    if (Element.isInstance(element)) {
        const {props, tag, children, links} = element;
        const node = document.createElement(tag);

        node.appendChild(
            createRTree(children)
        );

        const ondestroy = Object.keys(links).map(
            (name) =>  {
                const {link, binding} = links[name];
                return link(node, binding, element);
            }
        );

        element.ondestroy = () => {
            ondestroy.forEach(item => item());
        };

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
