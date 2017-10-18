import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';

const plugins = [
    babel({
        exclude: 'node_modules/**'
    }),

    builtins(),

    nodeResolve({
        module: true,
        jsnext: true,
        main: true,
        browser: true,
        preferBuiltins: false,
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    }),

    commonjs({
        include: [
            './lib/**',
        ],
        exclude: [],
        extensions: ['.js'],
        ignoreGlobal: false,
        sourceMap: true,
        namedExports: {
        },
        ignore: ['conditional-runtime-dependency']
    })
];

const exampleRender = {
    name: 'Daisy',
    input: 'src/todomvc.js',
    watch: {
        include: 'src/**'
    },
    output: {
        file: 'dist/todomvc.js',
        format: ['umd'],
        sourcemap: 'inline',
    },
    plugins
};

export default [
    exampleRender
];
