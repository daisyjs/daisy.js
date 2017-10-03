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

export default Element;
