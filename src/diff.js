import {isEmpty, isObject, isDate, properObject} from './helper';

function diff(lhs, rhs) {
    if (lhs === rhs) return {}; // equal return no diff

    if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

    const l = properObject(lhs);
    const r = properObject(rhs);

    const deletedValues = Object.keys(l).reduce((acc, key) => {
        return r.hasOwnProperty(key) ? acc : Object.assign({}, acc, {[key]: undefined });
    }, {});

    if (isDate(l) || isDate(r)) {
        if (l.valueOf() == r.valueOf()) return {};
        return r;
    }

    return Object.keys(r).reduce((acc, key) => {
        if (!l.hasOwnProperty(key)) return Object.assign({}, acc, {[key]: r[key] }); // return added r key

        const difference = diff(l[key], r[key]);

        if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff

        return Object.assign({}, acc, {[key]: difference }); // return updated key
    }, deletedValues);
}

export default diff;
