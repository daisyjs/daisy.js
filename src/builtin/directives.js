import { debug, uid, isNormalElement } from '../shared/helper';

const id = uid();

export default {
    // eslint-disable-next-line
    '/on.*/': (elem, binding, vnode) => {
        const { name, value } = binding;
        debug('name:');
        debug(name);

        const doSomthing = $event => {
            return value({ $event });
        };

        doSomthing.id = id();
        const event = name.slice(2).toLowerCase();
        if (isNormalElement(vnode)) {
            elem.addEventListener(event, doSomthing);
            return () => {
                elem.removeEventListener(event, doSomthing);
            };
        } else {
            vnode.componentInstance.on(event, doSomthing);
            return () => {
                vnode.componentInstance.removeListener(event, doSomthing);
            };
        }
    },
    // eslint-disable-next-line
    ref(elem, binding, vnode, context) {
        const { value } = binding;

        if (!isNormalElement(vnode)) {
            elem = vnode.componentInstance;
        }

        context.refs[value()] = elem;

        return () => {
            context.refs[value] = null;
        };
    }
};
