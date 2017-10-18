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
        setProps(node, {
            tag, type: props.type , props
        });       // props
    } else if (Elements.isInstance(element)) {
        const node = document.createDocumentFragment(); // package
        createElements(element, node);
    } else {
        node = document.createTextNode(element);
    }

    return node;
}

const acceptValue = (tag) => ['input', 'textarea', 'option', 'select', 'progress'].includes(tag);
const mustUseProp = (tag, type, attr) => (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
);


export function setProps(node, {tag, type, props}) {
    Object.keys(props).forEach((name) => {
        if (mustUseProp(tag, type, name)) {
            node[name] = props[name];
        } else {
            node.setAttribute(name, props[name]);
        }
    });
}

export function setStyle(node, styles) {
    Object.assign(node.style, styles);
}

