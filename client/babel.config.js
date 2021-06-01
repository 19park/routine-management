module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        'babel-plugin-styled-components',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '~': './src/',
                }
            },
        ],
        // ['transform-remove-console', {'exclude': ['error', 'warn']}]
    ],
};
