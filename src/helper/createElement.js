import {Element} from '../Types/Element';
import {Elements} from '../Types/Elements';
import {VComponent} from '../Types/VComponent';

export function createElements(elements, parent, context) {
    elements.forEach(
        element => appendElement(element, parent, context)
    );
    return parent;
}

export function appendElement(element, parent, context) {
    if (VComponent.isInstance(element)) {
        createComponent(element, context).mount(parent);
    } else {
        parent.appendChild(createElement(element, parent));
    }
}

export function createComponent(vComponent, context) {
    const {constructor: Constructor, props, children} = vComponent; 

    const component = new Constructor({
        state: props,
        body: children
    });
    link(component, vComponent);

    vComponent.setRef(component);
    component.parent = context;

    return component;
}

export function createElement(element) {
    const {props, tag, children} = element;
    let node;

    if (Element.isInstance(element)) {
        node = document.createElement(tag);

        createElements(children, node); // children
        link(node, element);         // links
        setProps(node, props);       // props
    } else if (element instanceof Elements) {
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