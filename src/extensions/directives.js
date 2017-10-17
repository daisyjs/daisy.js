import VComponent from '../shared/VComponent';
import {debug, uid} from '../shared/helper';

const id = uid();

export default {
    // eslint-disable-next-line
    '/on-.*/': (elem, binding, vnode) => {
        const {name, value} = binding;
        debug('name:');
        debug(name);

        const doSomthing = ($event) => {
            return value({$event});
        };

        doSomthing.id = id();
        const event = name.slice(3);
        if (vnode.componentInstance) {
            vnode.componentInstance.on(event, doSomthing);
            return () => {
                vnode.componentInstance.removeListener(event, doSomthing); 
            };
        } else {
            elem.addEventListener(event, doSomthing);
            return () => {
                elem.removeEventListener(event, doSomthing);
            };
        }
    },
    // eslint-disable-next-line
    ref(elem, binding, vnode, context) {
        const {value} = binding;
        
        context.refs[value()] = elem;
        return () => {
            context.refs[value] = null;
        };
    }
};