const { FlatCompat } = require('@eslint/eslintrc');
const { ESLint } = require('eslint');

const compat = new FlatCompat({
    baseDirectory: __dirname, // Lägg till baseDirectory
    recommendedConfig: ESLint.recommended // Lägg till recommendedConfig
});

module.exports = [
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react: require('eslint-plugin-react'),
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            // Lägg till dina specifika ESLint-regler här
        },
    },
    ...compat.extends('eslint:recommended'),
    ...compat.extends('plugin:react/recommended'),
    ...compat.extends('plugin:@typescript-eslint/recommended'),
];