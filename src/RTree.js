import {
    Element, Elements
} from './Element';

export function createRTree(elements) {
    const fragment = document.createDocumentFragment();
    
    elements.forEach(
        node =>
            fragment.appendChild(createRElement(node))
    );

    return fragment;
}

export function createRElement(element) {
    if (Element.isInstance(element)) {
        const {props, tag, children} = element;
        const node = document.createElement(tag);

        node.appendChild(
            createRTree(children)
        );

        link(node, element);

        setProps(node, props);

        return node;
    } else if (element instanceof Elements) {
        return createRTree(element);
    }

    return document.createTextNode(element);
}

export function setProps(node, props) {
    Object.keys(props).forEach((name) => {
        if (props[name] !== undefined) {
            node.setAttribute(name, props[name]);
        } else {
            node.removeAttribute(name);
        }
    });
}

export function setStyle(node, styles) {
    Object.assign(node.style, styles);
}

export function link(node, element) {
    const {links} = element;
    const ondestroy = Object.keys(links).map(
        (name) =>  {
            const {link, binding} = links[name];
            return link(node, binding, element);
        }
    );

    element.ondestroy = () => {
        ondestroy.forEach(item => item());
    };
}