import Element from '../../shared/Element';
import VComponent from '../../shared/VComponent';
import walkVDOM from './walk';
import patchComponents from './patchComponents';
import diffVElement from './diffItem';
import {VDOM} from '../../shared/constant';


function getVTree(vTree) {
    let temp = [];

    vTree.forEach((item) => {
        if (VComponent.isInstance(item)) {
            if (item.ref) {
                temp = [
                    ...temp,
                    ...getVTree(item.ref[VDOM])
                ];
            } else {
                temp.push(item);
            }
        } else if (Element.isInstance(item)) {
            const copy = Element.clone(item);
            const children = getVTree(item.children);
            copy.children = children;
            temp.push(copy);
        } else { //  if (typeof item === 'string')
            temp.push(item);
        }
    });
    return temp;
}


export default function diffVDOM(lastT, nextT) { // 讲 virtual dom 的组件全部替换为 节点之后，再 diff
    const patches = {};
    const vLastT = getVTree(lastT);
    
    patchComponents(lastT, nextT);
    const vNextT = getVTree(nextT);

    walkVDOM(vLastT, vNextT, (last, next, i) => {
        const result = diffVElement(last, next);

        if (!patches[i]) {
            patches[i] = [];
        }

        patches[i] = [
            ...patches[i], 
            ...result
        ];
    });

    return patches; // difference set
}


