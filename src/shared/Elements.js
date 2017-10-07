import Element from './Element';

export default class Elements extends Array {
    constructor() {
        super();
    }

    static create() {
        return new Elements();
    }

    push(element) {
        if (
            element instanceof Element || typeof element === 'string'
        ) {
            super.push(element);
        } else if (element instanceof Elements) {
            element.forEach(
                item => super.push(item)
            );
        }
        return this;
    }
}