const path = require('path');

module.exports = {
    name: 'example',
    input: path.join(__dirname, 'index.js'),
    watch: {
        include: path.join(__dirname, '**')
    },
    output: [
        {
            file: path.join(__dirname, 'dist.js'),
            format: ['umd'],
            sourceMap: 'inline'
        }
    ],
    plugins: []
};
