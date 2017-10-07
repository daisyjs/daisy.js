import {debug, isEmpty} from '../../shared/helper';
import diff from '../../shared/diff';
import {TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW,  MODIFY_BODY} from '../../shared/constant';
import VComponent from '../../shared/VComponent';

export default function diffItem(last, right) {
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