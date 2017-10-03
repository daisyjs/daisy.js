import {Parser} from './Parser';
import {
    createVirtualDOM, createViewTree,
    diffVirtualDOM, patch
} from './Render';

const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');

class Daisy {
    constructor({
        template = '',
        state = {}
    } = {}) {
        this.state = state;

        try {
            this.abstractSyntaxNode = Parser(template);
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

    mount(node) {
        const {abstractSyntaxNode, state, [METHODS]: methods} = this;
        // const methods = this[METHODS];

        // const methods = this.constructor._methods;
        this.virtualDOM = createVirtualDOM(abstractSyntaxNode, {
            state, methods
        });
        this.beforeMounted();
        const viewTree = createViewTree(this.virtualDOM);
        node.appendChild(viewTree);
        this.afterMounted();
    }

    setState(state) {

        if (state === this.state) {
            return false;
        }
        // setState
        this.state = state = Object.assign(this.state, state);
        // const methods = this.constructor._methods;

        // create virtualDOM
        const {abstractSyntaxNode, virtualDOM: lastVirtualDOM, [METHODS]: methods} = this;
        const newVirtualDOM = createVirtualDOM(abstractSyntaxNode, {
            state, methods
        });

        // diff virtualDOMs
        const difference = diffVirtualDOM(newVirtualDOM, lastVirtualDOM);

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
