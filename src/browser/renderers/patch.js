import {appendElement, createElement, setProps, setStyle} from './createElement';
import {debug} from '../../shared/helper';
import {TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW} from '../../shared/constant';
import Element from '../../shared/Element';
import link from '../../shared/link';

function walkDOM(tree, fn, index = -1) {
    tree.forEach(item => {
        fn(item, ++index);
        if (item.childNodes.length > 0) {
            index = walkDOM(item.childNodes, fn, index);
        }
    });
    return index;
}

export default function patch(dom, patches) {
    debug('dom:');
    debug(dom);
    debug('patches:');
    debug(patches);
    function patchElement(node, parent, nextElement) {
        return (currentPatch) => {
            const {type, changed, source} = currentPatch;
            let origin;

            if (Element.isInstance(changed)) {
                origin = changed.origin;
            } else if (typeof changed === 'string') {
                origin = changed;
            }

            switch (type) {
            case RELINK:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                link(node, origin);
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
                parent.insertBefore(createElement(origin), nextElement);
                // appendElement(origin, parent);
                break;

            case REPLACE:
                if (source.ondestroy) {
                    source.ondestroy();
                }
                parent.replaceChild(createElement(origin), node);
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

    walkDOM(dom, (node, index) => {
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