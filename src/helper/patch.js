import {createRElement, setProps, setStyle, link} from './createRElement';
import {debug} from './helper';
import {TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW} from '../constant';


function walkDom(tree, fn, index = -1) {
    tree.forEach(item => {
        fn(item, ++index);
        if (item.childNodes.length > 0) {
            index = walkDom(item.childNodes, fn, index);
        }
    });
    return index;
}

export function patch(rTree, patches) {
    debug('rTree:');
    debug(rTree);
    debug('patches:');
    debug(patches);
    function patchElement(node, parent, nextElement) {
        return (currentPatch) => {
            const {type, changed, source} = currentPatch;

            switch (type) {
            case RELINK:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                link(node, changed);
                break;

            case STYLE:
                setStyle(node.style, changed);
                break;

            case PROPS:
                setProps(node, changed);
                break;

            case TEXT:
                node[node.textContent ? 'textContent' : 'nodeValue'] = changed; // fuck ie
                break;

            case NEW:
                parent.insertBefore(createRElement(changed), nextElement);
                break;

            case REPLACE:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                parent.replaceChild(createRElement(changed), node);
                break;

            case REMOVE:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                parent.removeChild(node);
                break;
            default:
            }
        };
    }

    const list = [];

    walkDom(rTree, (node, index) => {
        list[index] = node;
    });

    // walk the difference set and update
    list.forEach((node, index) => {
        if (patches[index].length > 0) {
            patches[index].forEach(
                patchElement(node, node.parentNode, node.nextSibling)
            );
        }
    });

    list.length = 0; // gc
}