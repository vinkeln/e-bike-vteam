const { FlatCompat } = require('@eslint/eslintrc');
const { ESLint } = require('eslint');

const compat = new FlatCompat({
    baseDirectory: __dirname, // Lägg till basmappen för att hitta konfigurationer
    recommendedConfig: ESLint.recommended, // Lägg till rekommenderad konfiguration
});

module.exports = [
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        languageOptions: {
            ecmaVersion: 12,
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
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    ...compat.extends('eslint:recommended'),
    ...compat.extends('plugin:react/recommended'),
    ...compat.extends('plugin:@typescript-eslint/recommended'),
];