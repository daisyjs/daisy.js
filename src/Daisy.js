import {Parser} from './Parser';
import {
    createVirtualDOM, createViewTree,
    diffVirtualDOM, patch
} from './Render';

const STATE = Symbol('state');
const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');
const AST = Symbol('ast');
const VTREE = Symbol('vTree');

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
        }] of Daisy.__allInstances) {
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
            [AST]: ast, [STATE]: state,
            [METHODS]: methods
        } = this;
        // const methods = this[METHODS];

        // const methods = this.constructor._methods;
        this[VTREE] = createVirtualDOM(ast, {
            state, methods
        });
        this.beforeMounted();
        const viewTree = createViewTree(this[VTREE]);
        node.appendChild(viewTree);
        this.afterMounted();
    }

    setState(state) {

        if (state === this[STATE]) {
            return false;
        }
        // setState
        state = Object.assign(this[STATE], state);
        // const methods = this.constructor._methods;

        // create virtualDOM
        const {
            [AST]: ast, [VTREE]: lastVTree,
            [METHODS]: methods
        } = this;
        const nextVTree = createVirtualDOM(ast, {
            state, methods
        });

        // diff virtualDOMs
        const difference = diffVirtualDOM(nextVTree, lastVTree);

        // patch to dom
        this.beforePatched();
        patch(difference);
        this.afterPatched();
    }

    beforeMounted() {} // hook

    afterMounted() {}  // hook

    beforePatched() {} // hook

    afterPatched() {}  // hook

    static directive() {
        ensuneInstanceNameSpace(this, DIRECTIVES)[name] = method;
    }

    static component() {
        ensuneInstanceNameSpace(this, COMPONENTS)[name] = method;
    }

    static method(name, method) {
        ensuneInstanceNameSpace(this, METHODS)[name] = method;
    }
}

Daisy.__allInstances = new Map();
function ensuneInstanceNameSpace(ctx, namespace) {
    if (!Daisy.__allInstances.get(ctx)) {
        Daisy.__allInstances.set(ctx, {})
    }
    const instantce = Daisy.__allInstances.get(ctx);

    if (!instantce[namespace]) {
        instantce[namespace] = {};
    }

    return instantce[namespace];
}

export default Daisy;
