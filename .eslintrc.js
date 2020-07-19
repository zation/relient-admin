// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',

  plugins: [
    'css-modules',
  ],

  globals: {
    __BROWSER__: true,
  },

  extends: [
    'airbnb',
    'plugin:css-modules/recommended',
  ],

  env: {
    browser: true,
  },

  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'object-curly-newline': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
  },
};
