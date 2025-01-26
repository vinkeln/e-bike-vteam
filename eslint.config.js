const { FlatCompat } = require('@eslint/eslintrc'); // Importera FlatCompat för att stödja äldre extends
const compat = new FlatCompat({
    baseDirectory: __dirname, // Basen för att hitta konfigurationer
});

module.exports = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'], // Matcha alla JavaScript och TypeScript-filer
        languageOptions: {
            ecmaVersion: 2021, // Stöd för ES2021
            sourceType: 'module', // ES-moduler
            parser: require('@typescript-eslint/parser'), // Använd rätt parser
            parserOptions: {
                ecmaFeatures: {
                    jsx: true, // Aktivera JSX-stöd
                },
            },
        },
        plugins: {
            react: require('eslint-plugin-react'), // React-plugin
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'), // TypeScript ESLint-plugin
        },
        rules: {
            'react/react-in-jsx-scope': 'off', // React 17+ behöver inte `React` i scope
        },
        settings: {
            react: {
                version: 'detect', // Automatisk React-version
            },
        },
    },
    // Använd FlatCompat för att inkludera äldre extends
    ...compat.extends('eslint:recommended'),
    ...compat.extends('plugin:react/recommended'),
    ...compat.extends('plugin:@typescript-eslint/recommended'),
];
