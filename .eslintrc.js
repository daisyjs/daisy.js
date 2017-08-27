module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'globals': {
        'describe': false,
        'it': false
    },
    'extends': 'eslint:recommended',
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};