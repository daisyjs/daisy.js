import {debug, isEmpty} from '../../shared/helper';
import diff from '../../shared/diff';
import {TEXT, STYLE, PROPS, REPLACE, RELINK, REMOVE, NEW,  MODIFY_BODY} from '../../shared/constant';
import VComponent from '../../shared/VComponent';

export default function diffItem(last, next) {
    if (last === void 0) {
        return [{
            type: NEW,
            changed: next
        }];
    } 
    
    if (next === void 0) {
        return [{
            type: REMOVE,
            source: last
        }];
    }

    if (typeof last === typeof next) {
        if (typeof last === 'string') {
            if (last !== next) {
                return [{
                    type: TEXT,
                    changed: next
                }];
            }
            return [];
        }
    } else {
        return [{
            type: REPLACE,
            source: last,
            changed: next
        }];
    }

    const dif = [];

    // condition other changes (such as events eg.)
    if (last.tag !== next.tag) {
        return [{
            type: REPLACE,
            source: last,
            changed: next
        }];
    }

    const style = diff(last.props.style, next.props.style);
    if (!isEmpty(style)) {
        dif.push({
            type: STYLE,
            changed: style
        });
    }

    const props = diff(last.props, next.props);
    if (!isEmpty(props)) {
        dif.push({
            type: PROPS,
            changed: props
        });
    }

    if (VComponent.isInstance(last)) {
        const children = diff(last.children, next.children);
        if (!isEmpty(children)) {
            dif.push({
                type: MODIFY_BODY,
                changed: next.children
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
    
    if (hasLinks(last) && hasLinks(next)) {
        const links = someLinks(last.links, (name, lastLink) => {
            const nextLink = next.links[name];
            if (lastLink.binding.context !== nextLink.binding.context) {
                debug('context 不匹配，需要重新链接');
                return {
                    type: RELINK,
                    source: last,
                    changed: next
                };
            }
        });

        if (links) {
            dif.push(links);
        }
    } else if (hasLinks(last) || hasLinks(next)) {
        debug('link 函数被删除或添加，需要重新链接');
        dif.push({
            type: RELINK,
            source: last,
            changed: next
        });
    }
    return dif;
}