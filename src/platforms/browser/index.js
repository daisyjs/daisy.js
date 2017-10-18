import Lexer from '../../core/parser/Lexer';
import Parser from '../../core/parser/Parser';
import patch from './renderers/patch';
import directives from '../../builtin/directives';
import events from '../../builtin/events';
import annotations from '../../builtin/annotations';

import diffVDOM from '../../core/vdom/diff';
import createVDOM from '../../core/vdom/create';
import {createElements} from './renderers/dom';
import {noop, mixin, createDirective, createEvent, getProppertyObject} from '../../shared/helper';
import {allInherits} from '../../core/inherit';
import Events from 'events';
import {STATE, METHODS, DIRECTIVES, COMPONENTS, EVENTS, AST, VDOM, RDOM, EVENT, COMPUTED} from '../../shared/constant';

const {directive} = annotations;

@directive(directives)
class Component {
    render() {
        return '';
    }

    state() {
        return {};
    }

    constructor({
        state,
        body,
        context,
        computed = {},
        render = this.render
    } = {}) {
        this.compose({state, body, context, computed});

        const template = render();

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
                [COMPUTED]: _computed,
                body
            } = this;

            return createVDOM(this[AST], {
                components, directives, state, methods, context: this, body, computed: Object.assign({}, _computed, computed)
            });
        };

        this[VDOM] = this.render();

        this[EVENTS].forEach(({name, handler}) => {
            this.on(name, handler.bind(this));
        });

        this.ready(this[VDOM]);
    }

    compose({
        state = {},
        body = [],
        context,
        computed: _computed = []
    }) {
        this[STATE] = Object.assign({}, this.state(), state);
        this.body = body;
        this.context = context;
        this[EVENT] = new Events();

        this[METHODS] = {};
        this[DIRECTIVES] = [];
        this[COMPONENTS] = {};
        this[EVENTS] = [];
        this[COMPUTED] = [];
        this.refs = {};

        for (let [Componet, {
            [METHODS]: methods = [],
            [DIRECTIVES]: directives = [],
            [COMPONENTS]: components = [],
            [COMPUTED]: computed = [],
            [EVENTS]: events = []
        }] of allInherits(this.constructor)) {
            if (this instanceof Componet) {
                Object.assign(this[METHODS], getProppertyObject(methods));
                Object.assign(this[COMPONENTS], getProppertyObject(components));
                Object.assign(this[COMPUTED], getProppertyObject(computed), _computed);

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
        createElements(this[VDOM], node, this);
        this[RDOM] = node.childNodes;
        this.mounted(this[RDOM]);  // vDOM, realDOM

        return this;
    }

    setState(state) {
        if (state === this[STATE]) {
            return false;
        }

        this[STATE] = Object.assign(this[STATE], state); // @todo clone state
        
        const dif = this.patchDiff();

        this.patched(dif);
    }

    patchDiff() {
        const {[VDOM]: lastVDOM} = this;

        this[VDOM] = this.render();

        const dif = diffVDOM(lastVDOM, this[VDOM]);

        patch(this[RDOM], dif);

        return dif;
    }
}

mixin(Component, events);

const hooks = {
    parsed: noop, ready: noop, mounted: noop, patched: noop
};

mixin(Component, hooks); // hook

const verison = '1.0.0';

export {
    Component, annotations, Lexer, Parser, verison
};