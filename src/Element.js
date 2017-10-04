class Element {
    constructor(tagName, props, children, key) {
        this.tagName = tagName;

        this.props = props.reduce((prev, {name, value}) =>
            Object.assign(prev, {
                [name]: value
            })
            , {}) || [];

        this.children = children || [];
        this.key = key;
    }

    static create(...args) {
        return new Element(...args);
    }
}

class Elements extends Array {
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

export {
    Element, Elements
};
