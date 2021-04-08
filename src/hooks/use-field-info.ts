import type { ValidateStatus } from 'antd/es/form/FormItem';
import { useI18N } from 'relient/i18n';

export interface UseFieldInfoParams {
  touched?: boolean
  error?: string
  submitError?: string
}

export interface UseFieldInfo {
  validateStatus: ValidateStatus
  help?: string
}

export default ({ touched, error, submitError }: UseFieldInfoParams): UseFieldInfo => {
  const i18n = useI18N();
  return {
    validateStatus: touched && (error || submitError) ? 'error' : '',
    help: (touched && error && i18n(error))
      ? (touched && submitError && i18n(submitError)) : '',
  };
};
