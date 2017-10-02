const Parser = require('./Parser');
const Render = require('./Render');

class Daisy {
  constructor({
    template = ''
  }) {
    let nodes, vTree;
    try {
      nodes = Parser(template);
    } catch (e) {
      console.log('Parsed error: ' + (e.stack || e.toString()));
    }

    vTree = Render(nodes);

    this.mount = () => {
      this.beforeMounted();
      vTree.mount();
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

module.exports = Daisy;
