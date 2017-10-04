import {Lexer} from './Lexer';
import {Parser} from './Parser';
import {
    createVTree,
    diffVTree, patch
} from './VTree';

import {
    createRTree
} from './RTree';

const STATE = Symbol('state');
const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');
const AST = Symbol('ast');
const VTREE = Symbol('vTree');
const ALL_INSTANCES = Symbol('allInstances');
const RTREE = Symbol('rTree');

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
        this[STATE] = Object.assign(this.initialState, state);

        try {
            this[AST] = Parser(this.template);
        } catch (e) {
            throw new Error('Error in Parser: \n\t' + e.stack);
        }

        this[METHODS] = {};
        this[DIRECTIVES] = {};
        this[COMPONENTS] = {};
        for (let [Componet, {
            [METHODS]: methods,
            [DIRECTIVES]: directives,
            [COMPONENTS]: components,
        }] of Daisy[ALL_INSTANCES]) {
            if (this instanceof Componet) {
                Object.assign(this[METHODS], methods);
                Object.assign(this[DIRECTIVES], directives);
                Object.assign(this[COMPONENTS], components);
            }
        }
    }

    getState() {
        return this[STATE];
    }

    mount(node) {
        const {
            [AST]: ast,
            [STATE]: state,
            [METHODS]: methods,
            [DIRECTIVES]: directives
        } = this;

        this[VTREE] = createVTree(ast, {
            directives, state, methods, context: this
        });
        this.beforeMounted();
        const rTree = createRTree(this[VTREE]);
        node.appendChild(rTree);
        this[RTREE] = node.childNodes;
        this.afterMounted();
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

        // patch to dom
        this.beforePatched();
        patch(this[RTREE], difference);
        this.afterPatched();
    }

    beforeMounted() {} // hook

    afterMounted() {}  // hook

    beforePatched() {} // hook

    afterPatched() {}  // hook

    static directive(name, directive) {
        this.ensureInheritCache(DIRECTIVES)[name] = directive;
    }

    static component(name, Component) {
        this.ensureInheritCache(COMPONENTS)[name] = Component;
    }

    static method(name, method) {
        this.ensureInheritCache(METHODS)[name] = method;
    }

    static ensureInheritCache(cacheName) {
        if (!Daisy[ALL_INSTANCES].get(this)) {
            Daisy[ALL_INSTANCES].set(this, {});
        }
        const instantce = Daisy[ALL_INSTANCES].get(this);
        if (!instantce[cacheName]) {
            instantce[cacheName] = {};
        }
        return instantce[cacheName];
    }
}

Daisy[ALL_INSTANCES] = new Map();

export default Daisy;

export {
    Lexer, Parser
};
