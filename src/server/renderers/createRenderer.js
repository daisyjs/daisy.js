import {VDOM} from '../../shared/constant';
import Element from '../../shared/Element';

function createElements(elements) {
    const fragment = elements.map(
        element => createElement(element)
    );
    return fragment.join('');
}

function createElement(element) {
    const {props, tag, children} = element;

    if (Element.isInstance(element)) {
        const childrenString = createElements(children); // children
        const propsString = getProps(element, props);       // props
        return `<${tag} ${propsString}>${childrenString}</${tag}>`;
    }
    
    return element;
}

export function getProps(node, props) {
    return Object.keys(props).map((name) => {
        return `${name}='${props[name] || ''}'`;
    }).join(' ');
}

export default function() {
    return {
        renderToString(app) {
            return createElements(app[VDOM]);
        }
    };
}