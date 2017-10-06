import {Element} from '../Types/Element';
import {VComponent} from '../Types/VComponent';
import {link, createComponent} from './createElement';
import {debug, isEmpty} from './helper';
import diff from './diff';
import {VDOM, TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW, STATE} from '../constant';

function walkVDOM(lastT = [], nextT = [], fn, index = -1) {
    function hasChild(element) {
        return (Element.isInstance(element) && element.children.length > 0);
    }

    lastT.forEach((last, i) => {
        const next = nextT[i];
        fn(last, next, ++index);

        if (hasChild(last)) {
            const nextChildren = hasChild(next) ? next.children : [];
            index = walkVDOM(last.children, nextChildren, fn, index);
        }
    });

    if (nextT.length > lastT.length) {
        nextT.slice(lastT.length).forEach(
            (next) =>
                fn(void 0, next, index)
        );
    }

    return index;
}

// eslint-disable-next-line
function copyVElementState (from, to) {
    if (Element.isInstance(to)) {
        if (to.ondestroy === void 0
            && from !== void 0
            && from !== null
        ) {
            to.ondestroy = from.ondestroy;
        }
    }

    if (VComponent.isInstance(from) && VComponent.isInstance(to)) {
        to.ref = from.ref;
    }
}

function diffVElement(last, right) {
    if (last === void 0) {
        return [{
            type: NEW,
            changed: right
        }];
    } 
    
    if (right === void 0) {
        return [{
            type: REMOVE,
            source: last
        }];
    }

    if (typeof last === typeof right) {
        if (typeof last === 'string') {
            if (last !== right) {
                return [{
                    type: TEXT,
                    changed: right
                }];
            }
            return [];
        }
    } else {
        return [{
            type: REPLACE,
            source: last,
            changed: right
        }];
    }

    const dif = [];

    // condition other changes (such as events eg.)
    if (last.tag !== right.tag) {
        return [{
            type: REPLACE,
            source: last,
            changed: right
        }];
    }

    const style = diff(last.props.style, right.props.style);
    if (!isEmpty(style)) {
        dif.push({
            type: STYLE,
            changed: style
        });
    }

    const props = diff(last.props, right.props);
    if (!isEmpty(props)) {
        dif.push({
            type: PROPS,
            changed: props
        });
    }

    const hasLinks = (element) => element.links && Object.keys(element.links).length > 0;
    const someLinks = (links, fn) => {
        let returnValue;
        Object.keys(links).some((name, i) => {
            const link = links[name];
            return (returnValue = fn(name, link, i));
        });
        return returnValue;
    };
    
    if (hasLinks(last) && hasLinks(right)) {
        const links = someLinks(last.links, (name, lastLink) => {
            const rightLink = right.links[name];
            if (lastLink.binding.context !== rightLink.binding.context) {
                debug('context 不匹配，需要重新链接');
                return {
                    type: RELINK,
                    source: last,
                    changed: right
                };
            }
        });

        if (links) {
            dif.push(links);
        }
    } else if (hasLinks(last) || hasLinks(right)) {
        debug('link 函数被删除或添加，需要重新链接');
        dif.push({
            type: RELINK,
            source: last,
            changed: right
        });
    }
    return dif;
}

export function diffVDOM(lastT, nextT, start = 0) {
    const patches = {};
    let childSize = 0;
    let componentSize = 0;
    // patch Elemnts
    walkVDOM(lastT, nextT, (last, next, i) => {
        i = i + childSize - componentSize;
        const index = start + i;
        
        // intial
        if (!patches[index]) {
            patches[index] = [];
        }
        
        copyVElementState(last, next);
        const result = diffVElement(last, next);
        
        if (
            VComponent.isInstance(last)
        ) {
            result.forEach(
                item => 
                    patchComponent(Object.assign({}, item, {
                        source: last,
                        target: next
                    }))
            );

            const vDOM = {
                last: last.ref[VDOM],
                next: null
            };

            if (next.ref) {
                next.ref[VDOM] = vDOM.next = next.ref.render(next.props);
            } else {
                vDOM.next = next;
            }

            const childrenPatches = diffVDOM(vDOM.last, vDOM.next, index);
            
            Object.assign(patches, childrenPatches);

            childSize += Object.keys(childrenPatches).length;
            componentSize++;
            return;
        }

        patches[index] = [
            ...patches[index],
            ...result
        ];
    });
    return patches; // difference set
}

export function patchComponent({
    type, source, changed, target
}) {
    const component = source.ref;
    switch (type) {
    case PROPS:
        Object.assign(component[STATE], target.props);
        break;

    case RELINK:
        if (source.ondestroy) {
            source.ondestroy();
        }
        link(component, changed);
        break;

    case REPLACE:
        if (VComponent.isInstance(target)) {
            target.ref = createComponent(target, component.parent);
        }

        component.destroy();
        break;
        
    case REMOVE:
        component.destroy();
        break;
    default:
        target.ref = component;
    }
}