import walkVDOM from './walk';
import patchComponents from './patchComponents';
import diffVElement from './diffItem';
import getVTree from '../../shared/getVTree';


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


