import useI18N from './use-i18n';

export default ({ touched, error, tips }) => {
  const i18n = useI18N();
  return {
    validateStatus: touched && error ? 'error' : '',
    help: (touched && error && i18n(error)) || tips,
  };
};
