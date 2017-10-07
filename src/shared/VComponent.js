import Element from './Element';
import link from './link';

export default class VComponent extends Element {
    constructor(...args) {
        super(...args); 
    }

    setConstructor(constructor) {
        this.constructor = constructor;
        return this;
    }

    create() {
        const {constructor: Constructor, props, children, context} = this; 
    
        const component = new Constructor({
            state: props,
            body: children,
            context
        });

        link(component, this);
    
        this.ref = component;

        return component;
    }

    static create(...args) {
        return new VComponent(...args);
    }

    static isInstance(something) {
        return something instanceof VComponent;
    }
}