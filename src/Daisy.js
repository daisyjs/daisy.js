import {Lexer} from './Lexer';
import {Parser} from './Parser';
import {createVTree, diffVTree, patch} from './VTree';
import {createRTree} from './RTree';
import directives from './directives';
import {createDirective, createEvent, getProppertyObject} from './helper';
import {getAllInstances, initInstances, extendsInstanceInheritCache} from './InstanceManager';
import Events from 'events';

const STATE = Symbol('state');
const METHODS = Symbol('methods');
const DIRECTIVES = Symbol('directives');
const COMPONENTS = Symbol('components');
const EVENTS = Symbol('events');

const AST = Symbol('ast');
const VTREE = Symbol('vTree');
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
        this[DIRECTIVES] = [];
        this[COMPONENTS] = {};
        let eventsList = [];
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

                eventsList = [
                    ...eventsList, 
                    ...(events.map(item => createEvent(item)))
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
        debugger
        
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
        extendsInstanceInheritCache(this,DIRECTIVES)(...args);
    }

    static component(...args) {
        extendsInstanceInheritCache(this, COMPONENTS)(...args);
    }

    static method(...args) {
        extendsInstanceInheritCache(this, METHODS)(...args);
    }

    static event(...args) {
        extendsInstanceInheritCache(this, EVENTS)(...args);
    }
}

initInstances(Daisy);
Daisy.directive(directives);



export default Daisy;

export {
    Lexer, Parser
};
