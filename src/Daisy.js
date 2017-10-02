import {Parser} from './Parser';
import {Render} from './Render';

class Daisy {
  constructor({
    template = ''
  } = {}) {
    let nodes, vTree;
    try {
      nodes = Parser(template);
    } catch (e) {
      console.log('Parsed error: ' + (e.stack || e.toString()));
    }

    vTree = Render(nodes);

    this.mount = (mountNode) => {
      this.beforeMounted();
      const tree = vTree.render();
      mountNode.appendChild(tree);
      this.afterMounted();
    };
  }

  mount() {}

  beforeMounted() {}

  afterMounted() {}

  static directive() {

  }

  static component() {

  }
}

export default Daisy;
