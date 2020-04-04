export default ({ touched, error, tips }) => ({
  validateStatus: touched && error ? 'error' : '',
  help: (touched && error) || tips,
});
