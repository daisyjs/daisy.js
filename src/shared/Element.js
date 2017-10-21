import { getProppertyObject } from './helper';

export default class Element {
    constructor(
        tag = '',
        props = [],
        context = {},
        children = [],
        links = {},
        componentInstance,
        key
    ) {
        this.isElament = true;
        this.tag = tag;
        this.props = Array.isArray(props) ? getProppertyObject(props) : props;
        this.context = context;
        this.children = children;
        this.links = links;
        this.key = key;
        this.componentInstance = componentInstance;
    }

    static create(...args) {
        return new Element(...args);
    }

    static clone(element) {
        const newElement = new Element();
        return Object.assign(newElement, element);
    }

    static isInstance(element) {
        return element && element.isElament;
    }
}
