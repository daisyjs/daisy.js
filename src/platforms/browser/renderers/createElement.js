import Element from '../../../shared/Element';
import Elements from '../../../shared/Elements';
import link from '../../../shared/link';

export function createElements(elements, parent) {
    elements.forEach(
        element => appendElement(element, parent)
    );
    return parent;
}

export function appendElement(element, parent) {
    parent.appendChild(createElement(element, parent));
}

export function createElement(element) {
    const {props, tag, children} = element;
    let node;

    if (Element.isInstance(element)) {
        node = document.createElement(tag);

        createElements(children, node); // children
        link(node, element);         // links
        setProps(node, props);       // props
    } else if (Elements.isInstance(element)) {
        const node = document.createDocumentFragment(); // package
        createElements(element, node);
    } else {
        node = document.createTextNode(element);
    }

    return node;
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

