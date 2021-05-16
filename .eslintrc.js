// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
    'css-modules',
  ],

  globals: {
    __BROWSER__: true,
    tinymce: true,
  },

  extends: [
    'airbnb-typescript',
    'plugin:css-modules/recommended',
  ],

  parserOptions: {
    project: './tsconfig.json',
  },

  env: {
    browser: true,
  },

  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
    'object-curly-newline': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'max-len': ["error", { "code": 120 }],
  },
};
