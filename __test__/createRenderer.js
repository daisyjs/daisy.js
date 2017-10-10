const {createRenderer} = require('../dist/ssr');
const Daisy = require('../dist/daisy');

const renderer = createRenderer();
const view = renderer.renderToString(new Daisy({
    get state() {
        return {
            a: 'hello world!'
        }
    },
    render() {
        return `<div class='class1'>
            <div>
                {{a}}    
            </div>
        </div>`;
    }
}));

console.log(`<html>
    <head></head>
    <body>
        ${view}
    </body>
</html>`);