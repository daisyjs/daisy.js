import link from './link';

export default function createComponent(vComponent) {
    const {constructor: Constructor, props, children} = vComponent; 

    const component = new Constructor({
        state: props,
        body: children,
        context: vComponent.context
    });
    link(component, vComponent);

    vComponent.setRef(component);

    return component;
}