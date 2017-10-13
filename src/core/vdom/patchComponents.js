import link from '../../shared/link';
import {assignPrimitive} from '../../shared/helper';
import {NEW, VDOM, PROPS, REPLACE, RELINK, REMOVE, STATE, MODIFY_BODY} from '../../shared/constant';
import walkVDOM from './walk';
import Element from '../../shared/Element';
import VComponent from '../../shared/VComponent';
import diffVElement from './diffItem';


function copyVElementState (from, to) {
    if (
        Element.isInstance(to)
        && Element.isInstance(from)
        && !to.ondestroy
    ) {
        to.ondestroy = from.ondestroy;
        
        if (VComponent.isInstance(from) && VComponent.isInstance(to)) {
            to.ref = from.ref;
        }
    }
}

export default function patchComponents(lastT, nextT) {
    walkVDOM(lastT, nextT, (last, next) => {
        copyVElementState(last, next);

        const isPatchedComponent = VComponent.isInstance(last) || VComponent.isInstance(next);
        if (isPatchedComponent) {
            const result = diffVElement(last, next);
            result.forEach(
                item => 
                    patchComponent(Object.assign({}, item, {
                        source: last,
                        target: next
                    }))
            );

            const emptyarray = [];
            const vDOM = {
                last: emptyarray,
                next: emptyarray
            };

            if (last && last.ref) {
                vDOM.last = last.ref[VDOM];
            }

            if (next && next.ref) {
                next.ref[VDOM] = vDOM.next = next.ref.render(next.props);
            }

            patchComponents(vDOM.last, vDOM.next);
        }
    });
}



export function patchComponent({
    type, source = {}, changed = {}, target
}) {
    const component = source.ref;
    const patch = [];
    switch (type) {
    case MODIFY_BODY:
        target.ref.body = changed;
        break;

    case PROPS:
        // component[STATE] = Object.assign(component.state, target.props);
        assignPrimitive(component[STATE], changed);
        break;

    case NEW:
        target.create();
        break;

    case RELINK:
        if (source.ondestroy) {
            source.ondestroy();
        }
        link(component, changed);
        break;

    case REPLACE:
        if (VComponent.isInstance(source) && VComponent.isInstance(target)) {
            component.destroy();
            target.create();
        } else if (VComponent.isInstance(source) && !VComponent.isInstance(target)) {
            component.destroy();
        } else {
            target.create();
        }
        break;
        
    case REMOVE:
        component.destroy();
        break;
    default:
        target.ref = component;
    }

    return patch;
}