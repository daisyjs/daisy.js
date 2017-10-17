// link element or Component as vElement
import {uid} from './helper';

export default function link(node, element) {
    const {links} = element;
    const {directives, context} = links;
    const ondestroy = Object.keys(directives).map(
        (name) =>  {
            const {link, binding} = directives[name];
            return link(node, binding, element, context);
        }
    );

    element.ondestroy = () => {
        ondestroy.forEach(item => item());
    };

    element.ondestroy.id = uid();
}