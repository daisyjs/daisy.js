import {Lexer} from './Lexer';
import {Parser} from './Parser';
import {diffVDOM} from './helper/diffVDOM';
import {patch} from './helper/patch';
import {createVDOM} from './helper/createVElement';
import {createElements} from './helper/createElement';
import directives from './extension/directives';
import {createDirective, createEvent, getProppertyObject, getRootElement} from './helper/helper';
import {getAllInstances, initInstances, setCache} from './Types/InstanceManager';
import Events from 'events';
import {
    STATE, METHODS, DIRECTIVES, COMPONENTS, EVENTS, AST, VDOM, RDOM, EVENT
} from './constant';

class Daisy {
    render() {
        return '';
    }

    get state() {
        return {};
    }

    constructor({
        state
    } = {}) {
        this.compose({state});

        const template = this.render();

        try {
            this[AST] = Parser(template);
        } catch (e) {
            throw new Error('Error in Parser: \n\t' + e.stack);
        }

        this.parsed(this[AST]);

        this.render = () => {
            const {
                [METHODS]: methods,
                [STATE]: state,
                [DIRECTIVES]: directives,
                [COMPONENTS]: components,
            } = this;

            return createVDOM(this[AST], {
                components, directives, state, methods, context: this
            });
        };
        
        this[VDOM] = this.render();


        this[EVENTS].forEach(({name, handler}) => {
            this.on(name, handler.bind(this));
        });

        this.ready(this[VDOM]);
    }

    compose({
        state = {}
    }) {
        this[STATE] = Object.assign({}, this.state, state);
        this[EVENT] = new Events();

        this[METHODS] = {};
        this[DIRECTIVES] = [];
        this[COMPONENTS] = {};
        this[EVENTS] = [];
        this.refs = {};

        for (let [Componet, {
            [METHODS]: methods = [],
            [DIRECTIVES]: directives = [],
            [COMPONENTS]: components = [],
            [EVENTS]: events = []
        }] of getAllInstances(this.constructor)) {
            if (this instanceof Componet) {
                Object.assign(this[METHODS], getProppertyObject(methods));
                Object.assign(this[COMPONENTS], getProppertyObject(components));

                this[DIRECTIVES] = [
                    ...this[DIRECTIVES], ...directives.map((item) => createDirective(item))
                ];

                this[EVENTS] = [
                    ...this[EVENTS], 
                    ...(events.map(item => createEvent(item)))
                ];
            }
        }
    }

    on(...args) {
        return this[EVENT].on(...args);
    }

    once(...args) {
        return this[EVENT].once(...args);
    }

    emit(...args) {
        return this[EVENT].emit(...args);
    }

    removeListener(...args) {
        return this[EVENT].removeListener(...args);
    }

    removeAllListeners(...args) {
        return this[EVENT].removeAllListeners(...args);
    }

    getState() {
        return this[STATE];
    }

    destroy() {
        this.render = () => []; // render can create vDOM
        this.destroyed = true;
        this[STATE] = {};
        this.removeAllListeners();
    }

    mount(node) {
        this.mountNode = node;
        createElements(this[VDOM], node, this);
        this[RDOM] = node.childNodes;
        this.mounted(this[RDOM]);  // vDOM, realDOM
    }

    setState(state) {
        if (state === this[STATE]) {
            return false;
        }
        // setState
        Object.assign(this[STATE], state);

        const dif = getRootElement(this).diffPatch();

        this.patched(dif);
    }

    diffPatch() {
        // create virtualDOM
        const {[VDOM]: lastVDOM} = this;

        this[VDOM] = this.render();

        // diff virtualDOMs
        const dif = diffVDOM(lastVDOM, this[VDOM]);

        patch(this[RDOM], dif);

        return dif;
    }

    parsed() {}   // hook
    ready() {}   // hook
    mounted() {}  // hook
    patched() {}  // hook

    static directive(...args) {
        setCache(this,DIRECTIVES)(...args);
    }

    static component(...args) {
        setCache(this, COMPONENTS)(...args);
    }

    static method(...args) {
        setCache(this, METHODS)(...args);
    }

    static event(...args) {
        setCache(this, EVENTS)(...args);
    }
}

initInstances(Daisy);

Daisy.directive(directives);

Daisy.verison = '1.0.0';

export default Daisy;

export {
    Lexer, Parser
};
