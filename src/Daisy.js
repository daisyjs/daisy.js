import {Lexer} from './Lexer';
import {Parser} from './Parser';
import {createVTree, diffVTree, patch} from './VTree';

import {createRTree} from './RTree';

import directives from './directives';
import Events from 'events';

const STATE = Symbol('state');
const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');
const EVENTS = Symbol('events');

const AST = Symbol('ast');
const VTREE = Symbol('vTree');
const ALL_INSTANCES = Symbol('allInstances');
const RTREE = Symbol('rTree');
const EVENT = Symbol('event');

class Daisy {
    get template() {
        return '';
    }

    get initialState() {
        return {};
    }

    constructor({
        state = {}
    } = {}) {
        this[STATE] = Object.assign({}, this.initialState, state);
        this[EVENT] = new Events();

        this[METHODS] = {};
        this[DIRECTIVES] = {};
        this[COMPONENTS] = {};
        let eventsList = [];
        this.refs = {};
        
        for (let [Componet, {
            [METHODS]: methods = {},
            [DIRECTIVES]: directives = {},
            [COMPONENTS]: components = {},
            [EVENTS]: events = {}
        }] of Daisy[ALL_INSTANCES]) {
            if (this instanceof Componet) {
                Object.assign(this[METHODS], methods);
                Object.assign(this[DIRECTIVES], directives);
                Object.assign(this[COMPONENTS], components);

                eventsList = [
                    ...eventsList, 
                    ...(Object.keys(events).map(name => ({
                        name,
                        handler: events[name]
                    })))
                ];
            }
        }
        
        try {
            this[AST] = Parser(this.template);
        } catch (e) {
            throw new Error('Error in Parser: \n\t' + e.stack);
        }

        this.afterParsed(this[AST]);

        eventsList.forEach(({name, handler}) => {
            this.on(name, handler.bind(this));
        });

        const {
            [AST]: ast,
            [METHODS]: methods,
            [STATE]: initialState,
            [DIRECTIVES]: directives
        } = this;
        
        this[VTREE] = createVTree(ast, {
            directives, state: initialState, methods, context: this
        });

        this.afterInited(this[VTREE]);
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

    mount(node) {
        const rTree = createRTree(this[VTREE]);
        node.appendChild(rTree);
        this[RTREE] = node.childNodes;
        this.afterMounted(this[RTREE]);  // vDom, realDom
    }

    setState(state) {
        if (state === this[STATE]) {
            return false;
        }
        // setState
        state = Object.assign(this[STATE], state);

        // create virtualDOM
        const {
            [AST]: ast,
            [VTREE]: lastVTree,
            [METHODS]: methods,
            [DIRECTIVES]: directives
        } = this;

        this[VTREE] = createVTree(ast, {
            directives, state, methods, context: this
        });

        // diff virtualDOMs
        const difference = diffVTree(lastVTree, this[VTREE]);

        patch(this[RTREE], difference);

        this.afterPatched(this[RTREE], difference);
    }

    afterParsed() {}   // hook
    afterInited() {}   // hook
    afterMounted() {}  // hook
    afterPatched() {}  // hook

    static directive(...args) {
        this.ensureInheritCache(DIRECTIVES)(...args);
    }

    static component(...args) {
        this.ensureInheritCache(COMPONENTS)(...args);
    }

    static method(...args) {
        this.ensureInheritCache(METHODS)(...args);
    }

    static event(...args) {
        this.ensureInheritCache(EVENTS)(...args);
    }

    static ensureInheritCache(cacheName) {
        if (!Daisy[ALL_INSTANCES].get(this)) {
            Daisy[ALL_INSTANCES].set(this, {});
        }
        const instantce = Daisy[ALL_INSTANCES].get(this);
        if (!instantce[cacheName]) {
            instantce[cacheName] = {};
        }
        const cache = instantce[cacheName];

        return (name, value) => {
            if (!value) {
                return Object.assign(cache, name);
            }
            cache[name] = value;
        };
    }
}

Daisy[ALL_INSTANCES] = new Map();

Daisy.directive(directives);

export default Daisy;

export {
    Lexer, Parser
};
