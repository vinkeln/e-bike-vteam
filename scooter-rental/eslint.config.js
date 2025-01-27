// eslint.config.js
const reactPlugin = require('eslint-plugin-react');

module.exports = {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        globals: {
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
            process: "readonly",
            require: "readonly",
            module: "readonly"
        }
    },
    plugins: {
        react: reactPlugin
    },
    rules: {
        "no-unused-vars": "warn",
        "eqeqeq": "error",
        "no-undef": "error",
        "no-prototype-builtins": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
