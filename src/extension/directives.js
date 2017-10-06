import {VComponent} from '../Types/VComponent';
import {debug} from '../helper/helper';

export default {
    // eslint-disable-next-line
    '/on-.*/': (elem, binding, vnode) => {
        const {name, value} = binding;
        debug('name:');
        debug(name);

        const doSomthing = (e) => {
            return value({
                e
            });
        };
            
        const event = name.slice(3);
        
        if (VComponent.isInstance(vnode)) {
            elem.on(event, doSomthing);
            return () => {
                elem.removeListener(event, doSomthing);
            };
        } else {
            elem.addEventListener(event, doSomthing);
            return () => {
                elem.removeEventListener(event, doSomthing); 
            };
        }
    },
    // eslint-disable-next-line
    ref(elem, binding, vnode) {
        const {value, context} = binding;
        
        context.refs[value()] = elem;
        return () => {
            context.refs[value] = null;
        };
    }
};