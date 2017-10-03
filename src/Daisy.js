import {Parser} from './Parser';
import {
    createVirtualDOM, createViewTree,
    diffVirtualDOM, patch
} from './Render';
// import events from 'events';

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
        this.methods = Daisy._methods[this.constructor.name];
    }

    mount(node) {
        const {abstractSyntaxNode, state, methods} = this;
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
        const {abstractSyntaxNode, virtualDOM: lastVirtualDOM, methods} = this;
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

    beforeMounted() {}

    afterMounted() {}

    beforePatched() {}

    afterPatched() {}

    static directive() {

    }

    static component() {

    }

    static method(name, fn) {
        if (!this._methods[this.name]) {
            this._methods[this.name] = {}
        }

        this._methods[this.name][name] = fn;
    }
}

Daisy._methods = {};

export default Daisy;
