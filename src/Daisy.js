import {Parser} from './Parser';
import {
    createVTree, createRealTree,
    diffVTree, patch
} from './Render';

const STATE = Symbol('state');
const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');
const AST = Symbol('ast');
const VTREE = Symbol('vTree');
const ALL_INSTANCES = Symbol('allInstances');
const REAL_TREE = Symbol('realTree');

class Daisy {
    constructor({
        template = '',
        state = {}
    } = {}) {
        this[STATE] = state;

        try {
            this[AST] = Parser(template);
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
            [METHODS]: methods
        } = this;

        this[VTREE] = createVTree(ast, {
            state, methods
        });
        this.beforeMounted();
        this[REAL_TREE] = createRealTree(this[VTREE]);
        node.appendChild(this[REAL_TREE]);
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
            [METHODS]: methods
        } = this;

        this[VTREE] = createVTree(ast, {
            state, methods
        });

        // diff virtualDOMs
        const difference = diffVTree(this[VTREE], lastVTree);

        // patch to dom
        this.beforePatched();
        patch(this[REAL_TREE], difference);
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
