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
    }

    mount(node) {
        const {abstractSyntaxNode} = this;
        this.virtualDOM = createVirtualDOM(abstractSyntaxNode, this.state);
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
        this.state = state;

        // create virtualDOM
        const {abstractSyntaxNode, virtualDOM: lastVirtualDOM} = this;
        const newVirtualDOM = createVirtualDOM(abstractSyntaxNode, state);

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
}

export default Daisy;
