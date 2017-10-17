import walkVDOM from './walk';
import diffVElement from './diffItem';
// import getVTree from '../../shared/getVTree';


export default function diffVDOM(lastT, nextT) { // 讲 virtual dom 的组件全部替换为 节点之后，再 diff
    const patches = {};

    walkVDOM(lastT, nextT, (last, next, i) => {
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


