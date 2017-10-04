class Element {
    constructor(tagName, props, children, key) {
        this.tagName = tagName;
        this.props = props || [];
        this.children = children || [];
        this.key = key;
    }

    static create(...args) {
        return new Element(...args);
    }
}

class Elements {
    constructor(elment) {
        this.elements = [];
    }

    static create() {
        return new Elements();
    }

    push(element) {
        if (
            element instanceof Element || typeof element === 'string'
        ) {
            this.elements.push(element)
        } else if (element instanceof Elements) {
            this.elements = [
                ...this.elements, ...element.elements
            ]
        }
        return this;
    }

    getElements() {
        return this.elements;
    }
}

export {
    Element, Elements
}
