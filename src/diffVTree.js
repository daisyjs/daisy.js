import {Element} from './Element';
import {VComponent} from './VComponent';
import {link, appendElement} from './createRElement';
import {debug, isEmpty} from './helper';
import diff from './diff';
import {VTREE, TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW} from './constant';

function getWholeVTree (vTree) {
    let temp = [];
    vTree.forEach(item => {
        if (VComponent.isInstance(item)) {
            temp = temp.concat(getWholeVTree(item.ref[VTREE]));
            return;
        } else if (typeof item === 'string') {
            temp.push(item);
        } else if (Element.isInstance(item)) {
            let children = item.children;
            
            if (children && children.length > 0) {
                children = getWholeVTree(children);
            }

            const newItem = Object.assign(item, {
                children
            });
            temp.push(newItem);
            return;
        }
    });
    return temp;
}

function diffVElement(element1 = {}, element2 = {}) {
    function diffStyle() {
        const styleDiff = diff(element1.props.style, element2.props.style);

        if (!isEmpty(styleDiff)) {
            return {
                type: STYLE,
                changed: styleDiff
            };
        }
    }

    function diffProps() {
        const propsDiff = diff(element1.props, element2.props);

        if (!isEmpty(propsDiff)) {
            return {
                type: PROPS,
                changed: propsDiff
            };
        }
    }

    function diffTag() {
        // condition other changes (such as events eg.)
        if (element1.tag !== element2.tag) {
            return {
                type: REPLACE,
                source: element1,
                changed: element2
            };
        }
    }

    function diffLinks() {
        const hasLinks = (element) => element.links && Object.keys(element.links).length > 0;
        const eachLinks = (links, fn) => {
            let returnValue;
            Object.keys(links).some((name, i) => {
                const link = links[name];
                returnValue = fn(name, link, i);
                return returnValue;
            });
            return returnValue;
        };
        
        if (hasLinks(element1) && hasLinks(element2)) {
            return eachLinks(element1.links, (name, link1) => {
                const link2 = element2.links[name];
                if (link1.binding.context === link2.binding.context) {
                    debug('context 匹配，不需要重新链接');
                } else {
                    debug('context 不匹配，需要重新链接');
                    return {
                        type: RELINK,
                        source: element1,
                        changed: element2
                    };
                }
            });
        } else if (hasLinks(element1) || hasLinks(element2)) {
            debug('link 函数被删除或添加，需要重新链接');
            return {
                type: RELINK,
                source: element1,
                changed: element2
            };
        }
    }

    if (typeof element1 !== typeof element2) {
        return [{
            type: REPLACE,
            source: element1,
            changed: element2
        }];
    }

    if (
        typeof element1 === 'string' &&
        typeof element2 === 'string'
    ) {
        if (element1 !== element2) {
            return [{
                type: TEXT,
                changed: element2
            }];
        }
        return [];
    }

    const changes = [];
    return [diffStyle, diffProps, diffTag, diffLinks].reduce((prev, item) => {
        const result = item();
        if (result) {
            prev.push(result);
        }
        return prev;
    }, changes);
}

function walkVTree(lastTree = [], nextTree = [], fn, index = -1) {
    function hasChild(element) {
        return (Element.isInstance(element) && element.children.length > 0);
    }

    lastTree.forEach((lastTreeLeaf, leafIndex) => {
        const nextTreeLeaf = nextTree[leafIndex];
        fn(lastTreeLeaf, nextTreeLeaf, ++index);

        if (hasChild(lastTreeLeaf)) {
            const nextTreeLeafChildren = hasChild(nextTreeLeaf) ? nextTreeLeaf.children : [];
            index = walkVTree(lastTreeLeaf.children, nextTreeLeafChildren, fn, index);
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


export function diffVTree(lastVTree, nextVTree) {
    const patches = {};

    walkVTree(lastVTree, nextVTree, (lastTreeLeaf, nextTreeLeaf) => {
        // copy some things
        if (Element.isInstance(nextTreeLeaf)) {
            if (nextTreeLeaf.ondestroy === void 0
                && lastTreeLeaf !== void 0
                && lastTreeLeaf !== null
            ) {
                nextTreeLeaf.ondestroy = lastTreeLeaf.ondestroy;
            }

            if (lastTreeLeaf && lastTreeLeaf.ref) {
                nextTreeLeaf.ref = lastTreeLeaf.ref;
            }
        }
    });

    // patch Elemnts
    walkVTree(lastVTree, nextVTree, (lastTreeLeaf, nextTreeLeaf) => {
        if (
            VComponent.isInstance(lastTreeLeaf) || 
            VComponent.isInstance(nextTreeLeaf)
        ) {
            
            if (lastTreeLeaf === void 0) {
                return patchComponent({
                    type: NEW,
                    changed: nextTreeLeaf
                });
            }

            if (nextTreeLeaf === void 0) {
                return patchComponent({
                    type: REMOVE,
                    source: lastTreeLeaf
                });
            }

            diffVElement(lastTreeLeaf, nextTreeLeaf).map((item) => patchComponent(Object.assign({}, item, {
                source: lastTreeLeaf,
                target: nextTreeLeaf
            })));
        }
    });

    
    const wholeLastTree = getWholeVTree(lastVTree);
    const wholeNextTree = getWholeVTree(nextVTree);

    debug('wholeLastTree: ');
    debug(wholeLastTree);
    
    debug('wholeNextTree: ');
    debug(wholeNextTree);
    
    walkVTree(wholeLastTree, wholeNextTree, (lastTreeLeaf, nextTreeLeaf, index) => {
        patches[index] = patches[index] || [];
        if (
            !VComponent.isInstance(lastTreeLeaf) && !VComponent.isInstance(nextTreeLeaf)
        ) {
            if (lastTreeLeaf === void 0) {
                patches[index].push({
                    type: NEW,
                    changed: nextTreeLeaf
                });
                return;
            }
    
            if (nextTreeLeaf === void 0) {
                patches[index].push({
                    type: REMOVE,
                    source: lastTreeLeaf
                });
                return;
            }
    
            patches[index] = patches[index].concat(
                diffVElement(lastTreeLeaf, nextTreeLeaf)
            );
        }
    });

    return patches; // difference set
}

export function patchComponent({
    type, source, changed, target
}) {
    const component = source.ref;
    switch (type) {
    case PROPS:
        component.setState(target.props);
        break;
    case RELINK:
        if (source.ondestroy) {
            source.ondestroy();
        }
        link(component, changed);
        break;
    case REPLACE:
        component.destroy();
        appendElement(changed, component.mountNode);
        break;
        
    case REMOVE:
        component.destroy();
        break;
    default:
        // eslint-disable-next-line
        debugger
    }
}