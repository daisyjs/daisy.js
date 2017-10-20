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
        extensions: ['.js', '.coffee'],
        ignoreGlobal: false,
        sourceMap: true,
        namedExports: {
        },
        ignore: ['conditional-runtime-dependency']
    })
];

const daisy = {
    name: 'Daisy',
    input: 'src/platforms/browser/index.js',
    watch: {
        include: 'src/**'
    },
    output: {
        file: 'dist/daisy.js',
        format: ['umd'],
        // sourcemap: 'inline',
        // exports: 'default',
    },
    plugins
};

const serverRender = {
    name: 'Daisy',
    input: 'src/platforms/server/index.js',
    watch: {
        include: 'src/**'
    },
    output: {
        file: 'dist/ssr.js',
        format: ['umd'],
        sourcemap: 'inline',
    },
    plugins
};

const exampleRender = {
    name: 'Daisy',
    input: 'examples/index.js',
    watch: {
        include: 'examples/**'
    },
    output: {
        file: 'examples/dist.js',
        format: ['umd'],
        sourcemap: 'inline',
    },
    plugins
};

export default [
    daisy, serverRender, exampleRender
];
