const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat();

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
