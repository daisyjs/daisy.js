export default {
    // eslint-disable-next-line
    '/on-.*/': (elem, binding, vnode) => {
        const {name, value} = binding;
        const doSomthing = (e) => {
            return value({
                e
            });
        };
            
        const event = name.slice(3);

        elem.addEventListener(event, doSomthing);
        return () => {
            elem.removeEventListener(event, doSomthing); 
        };
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