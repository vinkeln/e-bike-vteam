module.exports = {
    env: {
      browser: true, // Lägger till webbläsarspecifika globala variabler
      es2021: true, // Aktiverar ES2021 syntax support
      node: true // Aktiverar Node.js globala variabler och Node.js scoping
    },
    extends: [
      'eslint:recommended', // Använder ESLint rekommenderade regler
      'plugin:react/recommended' // Om du använder React, annars ta bort detta
    ],
    parserOptions: {
      ecmaVersion: 12, // Moderna JavaScript-funktioner
      sourceType: 'module', // Aktiverar användning av ES Modules
      ecmaFeatures: {
        jsx: true // Om du använder JSX, annars sätt detta till false
      }
    },
    rules: {
      'no-unused-vars': 'warn', // Varnar för oanvända variabler
      'no-console': 'off', // Tillåter användning av console.log, etc.
      'eqeqeq': ['error', 'always'], // Kräver strikt jämförelse '==='
      'curly': 'error' // Kräver klammerparenteser för alla kontrollstrukturer
    },
    settings: {
      react: {
        version: 'detect' // Låter ESLint automatiskt upptäcka versionen av React
      }
    }
  };
  