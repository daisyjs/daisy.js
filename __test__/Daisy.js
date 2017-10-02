const Daisy = require('../src/Daisy');

const component = new Daisy({
    template: `
        <div>
            {{a}}
        </div>
    `
});

component.mount('#id');
