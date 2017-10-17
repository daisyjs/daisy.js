import Element from './Element';
import link from './link';

export default class VComponent extends Element {
    constructor(...args) {
        super(...args); 
        const computed = args[5];
        const constructor = args[6];

        this.computed = computed;
        this.constructor = constructor;
    }

    create() {
        const {constructor: Constructor, props, children, context} = this; 
    
        const component = new Constructor({
            state: props,
            body: children,
            context
        });

        link(component, this);
    
        this.componentInstance = component;

        return component;
    }

    static create(...args) {
        return new VComponent(...args);
    }

    static isInstance(something) {
        return something instanceof VComponent;
    }
}