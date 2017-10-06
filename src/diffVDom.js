import {Element} from './Element';
import {VComponent} from './VComponent';
import {link, createComponent} from './createRElement';
import {debug, isEmpty} from './helper';
import diff from './diff';
import {VDom, TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW, STATE} from './constant';

function walkVDom(lastTree = [], nextTree = [], fn, index = -1) {
    function hasChild(element) {
        return (Element.isInstance(element) && element.children.length > 0);
    }

    lastTree.forEach((lastTreeLeaf, leafIndex) => {
        const nextTreeLeaf = nextTree[leafIndex];
        fn(lastTreeLeaf, nextTreeLeaf, ++index);

        if (hasChild(lastTreeLeaf)) {
            const nextTreeLeafChildren = hasChild(nextTreeLeaf) ? nextTreeLeaf.children : [];
            index = walkVDom(lastTreeLeaf.children, nextTreeLeafChildren, fn, index);
        }
    });

    if (nextTree.length > lastTree.length) {
        nextTree.slice(lastTree.length).forEach(
            (nextTreeLeaf) =>
                fn(void 0, nextTreeLeaf, index)
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
}

function diffVElement(left, right) {
    if (left === void 0) {
        return [{
            type: NEW,
            changed: right
        }];
    } 
    
    if (right === void 0) {
        return [{
            type: REMOVE,
            source: left
        }];
    }

    if (typeof left === typeof right) {
        if (typeof left === 'string') {
            if (left !== right) {
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
            source: left,
            changed: right
        }];
    }

    const dif = [];

    // condition other changes (such as events eg.)
    if (left.tag !== right.tag) {
        return [{
            type: REPLACE,
            source: left,
            changed: right
        }];
    }

    const styleDif = diff(left.props.style, right.props.style);
    if (!isEmpty(styleDif)) {
        dif.push({
            type: STYLE,
            changed: styleDif
        });
    }

    const propsDif = diff(left.props, right.props);
    if (!isEmpty(propsDif)) {
        dif.push({
            type: PROPS,
            changed: propsDif
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
    
    if (hasLinks(left) && hasLinks(right)) {
        const linksDif = someLinks(left.links, (name, leftLink) => {
            const rightLink = right.links[name];
            if (leftLink.binding.context !== rightLink.binding.context) {
                debug('context 不匹配，需要重新链接');
                return {
                    type: RELINK,
                    source: left,
                    changed: right
                };
            }
        });

        if (linksDif) {
            dif.push(linksDif);
        }
    } else if (hasLinks(left) || hasLinks(right)) {
        debug('link 函数被删除或添加，需要重新链接');
        dif.push({
            type: RELINK,
            source: left,
            changed: right
        });
    }
    return dif;
}

export function diffVDom(lastVDom, nextVDom, startIndex = 0) {
    const patches = {};
    let childrenCount = 0;
    // patch Elemnts
    walkVDom(lastVDom, nextVDom, (lastTreeLeaf, nextTreeLeaf, index) => {
        index += childrenCount;
        // intial
        patches[startIndex + index] = patches[startIndex + index] || [];

        copyVElementState(lastTreeLeaf, nextTreeLeaf);
        const result = diffVElement(lastTreeLeaf, nextTreeLeaf);
        
        if (
            VComponent.isInstance(lastTreeLeaf)
        ) {
            result.forEach(
                item => 
                    updateComponent(Object.assign({}, item, {
                        source: lastTreeLeaf,
                        target: nextTreeLeaf
                    }))
            );

            const lastTreeLeafChildrenVDom = lastTreeLeaf.ref[VDom];
            let nextTreeLeafChildrenVDom;

            if (nextTreeLeaf.ref) {
                nextTreeLeafChildrenVDom = nextTreeLeaf.ref.render(nextTreeLeaf.props);
                nextTreeLeaf.ref[VDom] = nextTreeLeafChildrenVDom;
            } else {
                nextTreeLeafChildrenVDom = nextTreeLeaf;
            }

            const childrenPatches = diffVDom(lastTreeLeafChildrenVDom, nextTreeLeafChildrenVDom, index);
            
            Object.assign(patches, childrenPatches);

            childrenCount += Object.keys(childrenPatches).length - 1;
            patches[startIndex + index].length = 0;
        } else {
            const currentPatches = patches[startIndex + index];
            patches[startIndex + index] = [
                ...currentPatches,
                ...result];
        }
    });
    return patches; // difference set
}

export function updateComponent({
    type, source, changed, target
}) {
    const component = source.ref;
    switch (type) {
    case PROPS:
        Object.assign(component[STATE], target.props);
        target.ref = component;
        break;

    case RELINK:
        if (source.ondestroy) {
            source.ondestroy();
        }
        link(component, changed);
        target.ref = component;
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
        // eslint-disable-next-line
    }
}