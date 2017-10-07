import {Element} from './Element';

export class VComponent extends Element {
    constructor(...args) {
        super(...args); 
    }

    setConstructor(constructor) {
        this.constructor = constructor;
        return this;
    }

    setRef(ref) {
        this.ref = ref;
        return this;
    }

    static create(...args) {
        return new VComponent(...args);
    }

    static isInstance(something) {
        return something instanceof VComponent;
    }
}