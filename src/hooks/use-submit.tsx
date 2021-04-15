import {
  useCallback,
  useState,
} from 'react';
import type { FormInstance } from 'antd/es/form';
import {
  map,
  isArray,
  find,
  propEq,
} from 'lodash/fp';

export interface OnSubmit {
  (values: any, form?: FormInstance): Promise<any>
}

export interface Submit {
  (values: any): any
}

interface Result {
  submit: Submit
  submitting: boolean | undefined
  submitSucceeded: boolean
  submitFailed: boolean
  defaultError: string | undefined
}

export default (
  onSubmit: OnSubmit,
  form?: FormInstance,
): Result => {
  const [submitting, setSubmitting] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [defaultError, setDefaultError] = useState<string>();

  return {
    submit: useCallback(async (values) => {
      try {
        setSubmitting(true);
        const result = await onSubmit(values, form);
        setSubmitting(false);
        setDefaultError(undefined);
        setSubmitSucceeded(true);
        setSubmitFailed(false);
        return result;
      } catch (e) {
        console.warn('Submission error:', e);
        setSubmitting(false);
        setDefaultError(find(propEq('field', 'default'))(e));
        setSubmitSucceeded(false);
        setSubmitFailed(true);
        if (isArray(e) && form) {
          form.setFields(map(({ field, message }) => ({ name: field, errors: [message] }))(e));
        }
        return e;
      }
    }, [onSubmit, form]),
    submitting,
    submitSucceeded,
    submitFailed,
    defaultError,
  };
};
