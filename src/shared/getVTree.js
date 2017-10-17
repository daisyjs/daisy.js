import Element from './Element';
import VComponent from './VComponent';
import {VDOM} from './constant';

export default function getVTree(vTree) {
    let temp = [];

    vTree.forEach((item) => {
        if (VComponent.isInstance(item)) {
            if (item.componentInstance) {
                temp = [
                    ...temp,
                    ...getVTree(item.componentInstance[VDOM])
                ];
            } else {
                temp.push(item);
            }
        } else if (Element.isInstance(item)) {
            const copy = Element.clone(item);
            const children = getVTree(item.children);
            copy.children = children;
            copy.origin = item;
            temp.push(copy);
        } else { //  if (typeof item === 'string')
            temp.push(item);
        }
    });
    return temp;
}