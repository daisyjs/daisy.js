import {Element} from '../shared/Element';
import {VComponent} from '../shared/VComponent';
import {link, createComponent} from './createElement';
import {debug, isEmpty} from './helper';
import diff from './diff';
import {VDOM, TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW, STATE, MODIFY_BODY} from '../shared/constant';

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

    if (VComponent.isInstance(last)) {
        const children = diff(last.children, right.children);
        if (!isEmpty(children)) {
            dif.push({
                type: MODIFY_BODY,
                changed: right.children
            });
        }
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

function updateComponents(lastT, nextT) {
    walkVDOM(lastT, nextT, (last, next) => {
        copyVElementState(last, next);
        const result = diffVElement(last, next);
        const isPatchedComponent = VComponent.isInstance(last) || VComponent.isInstance(next);
        if (isPatchedComponent) {
            result.forEach(
                item => 
                    updateComponent(Object.assign({}, item, {
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

            updateComponents(vDOM.last, vDOM.next);
        }
    });
}

export function diffVDOM(lastT, nextT) { // 讲 virtual dom 的组件全部替换为 节点之后，再 diff
    const patches = {};
    const vLastT = getVTree(lastT);
    
    updateComponents(lastT, nextT);
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


export function updateComponent({
    type, source, changed, target
}) {
    const component = source.ref;
    const patch = [];
    switch (type) {
    case MODIFY_BODY:
        target.ref.body = changed;
        break;

    case PROPS:
        component[STATE] = Object.assign(component.state, target.props);
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
            target.setRef(createComponent(target));
        } else if (VComponent.isInstance(source) && !VComponent.isInstance(target)) {
            component.destroy();
        } else {
            target.setRef(createComponent(target));
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