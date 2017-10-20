const Daisy = require('../dist/daisy');

const component = new Daisy({
    template: `
        <div>
            {{a}}
        </div>
    `
});

component.mount('#id');
