import { METHODS, DIRECTIVES, COMPONENTS, EVENTS, COMPUTED } from '../shared/constant';
import {setInheritCache} from '../core/inherit';

function register(setter) {
    return function(...args) {
        return function(target) {
            if (args.length > 0) {
                setter(target)(...args);
            }
        };
    };
}

const annotations = {
    component: register(
        setInheritCache(COMPONENTS)
    ),
    directive: register(
        setInheritCache(DIRECTIVES)
    ),
    event: register(
        setInheritCache(EVENTS)
    ),
    computed: register(
        setInheritCache(COMPUTED)
    ),
    method: register(
        setInheritCache(METHODS)
    ),
};


export default annotations;