import {Parser} from './Parser';
import {
    Render, createVirtualDOM, createViewTree,
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
      this.ast = Parser(template);
    } catch (e) {
      throw new Error('Error in Parser: \n' + (e.stack || e.toString()));
    }
  }

  mount(node) {
      this.virtualDOM = createVirtualDOM(this.state);
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
      const lastVirtualDOM = this.virtualDOM;
      const newVirtualDOM = createVirtualDOM(state);

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
