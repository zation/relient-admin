// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  plugins: [
    ['import', { libraryName: 'antd', style: false }],
    ['lodash', { id: ['lodash'] }],
  ],
};
