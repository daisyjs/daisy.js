import {EVENT} from '../shared/constant';

export default {
    on(...args) {
        return this[EVENT].on(...args);
    },

    once(...args) {
        return this[EVENT].once(...args);
    },

    emit(...args) {
        return this[EVENT].emit(...args);
    },

    removeListener(...args) {
        return this[EVENT].removeListener(...args);
    },

    removeAllListeners(...args) {
        return this[EVENT].removeAllListeners(...args);
    }
};