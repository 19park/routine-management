module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    env: {
        'react-native/react-native': true,
        jest: true,
    },
    parser: 'babel-eslint',
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            'babel-module': {},
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.native.js'],
            },
        },
    },
    parserOptions: {
        ecmaFeatures: {
            ecmaVersion: 8,
            experimentalObjectRestSpread: true,
            jsx: true,
        },
        sourceType: 'module',
    },
    plugins: ['react', 'react-native'],
    rules: {
        indent: ['error', 4, {SwitchCase: 1}],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'linebreak-style': ['error', 'unix'],
        'no-undef': ['error'],
        'no-console': ['off'],
        'no-unused-vars': ['warn'],
        'react/prop-types': ['off'],
        'react/jsx-no-bind': ['off'],
        'react-native/no-single-element-style-arrays': 2,
        'react-native/no-inline-styles': ['off'],
        'react-native/no-unused-styles': ['off'],
        'react-native/split-platform-components': ['warn'],
        'react-native/no-color-literals': ['off'],
    },
};
