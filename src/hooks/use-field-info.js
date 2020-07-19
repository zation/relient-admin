import useI18N from './use-i18n';

export default ({ touched, error, tips, submitError }) => {
  const i18n = useI18N();
  return {
    validateStatus: touched && (error || submitError) ? 'error' : '',
    help: (touched && error && i18n(error))
      || (touched && submitError && i18n(submitError))
      || tips,
  };
};
