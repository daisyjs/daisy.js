import {getProppertyObject} from '../helper/helper';

export class Element {
    constructor(tag = '', props = [], children = [], links = {}, key) {
        this.tag = tag;

        this.props = getProppertyObject(props);

        this.children = children;
        this.links = links;
        this.key = key;
    }

    static create(...args) {
        return new Element(...args);
    }

    static clone(element) {
        const newElement = new Element();
        return Object.assign(newElement, element);
    }

    static isInstance(something) {
        return something instanceof Element;
    }
}
