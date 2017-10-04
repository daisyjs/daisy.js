export default {
    '/on-.*/': (elem, binding, vnode) => {
        const {name, expression} = binding;
        const doSomthing = (e) => 
            expression({
                e
            });
        const event = name.slice(3);

        elem.addEventListener(event, doSomthing);
        return () => {
            elem.removeEventListener(event, doSomthing); 
        };
    }
};