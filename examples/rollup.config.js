const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');

const plugins = [
    builtins(),
    nodeResolve({
        module: true,
        jsnext: true,
        main: true,
        browser: true,  // Default: false
        preferBuiltins: false,  // Default: true ,
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    }),
    commonjs({
        // non-CommonJS modules will be ignored, but you can also
        // specifically include/exclude files
        include: [
            './lib/**',
        ], // Default: undefined
        exclude: [], // Default: undefined
        // these values can also be regular expressions
        // include: /node_modules/

        // search for files other than .js files (must already
        // be transpiled by a previous plugin!)
        extensions: ['.js', '.coffee'], // Default: [ '.js' ]

        // if true then uses of `global` won't be dealt with by this plugin
        ignoreGlobal: false, // Default: false

        // if false then skip sourceMap generation for CommonJS modules
        sourceMap: true, // Default: true

        // explicitly specify unresolvable named exports
        // (see below for more details)
        namedExports: {
        }, // Default: undefined

        // sometimes you have to leave require statements
        // unconverted. Pass an array containing the IDs
        // or a `id => boolean` function. Only use this
        // option if you know what you're doing!
        ignore: ['conditional-runtime-dependency']
    })
];

const exampleRender = {
    name: 'Daisy',
    input: 'index.js',
    watch: {
        include: '**'
    },
    output: {
        file: 'dist.js',
        format: ['umd'],
        sourcemap: 'inline',
        // exports: 'default',
    },
    plugins
};

module.exports = [
    exampleRender
];
