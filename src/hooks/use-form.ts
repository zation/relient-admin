import { Form } from 'antd';
import {
  useCallback,
  useState,
} from 'react';
import {
  find,
  isArray,
  map,
  propEq,
  every,
  flow,
  prop,
  size,
  eq,
} from 'lodash/fp';
import type { FormInstance } from 'antd/es/form';
import type { FieldError } from 'rc-field-form/es/interface';
import useIsFormEditing from './use-is-form-editing';

const { useForm } = Form;

export interface OnSubmit<Values, SubmitReturn> {
  (values: Values, form: FormInstance): Promise<SubmitReturn>
}

export interface Submit<Values, SubmitReturn> {
  (values: Values): Promise<SubmitReturn | null>
}

interface Result<Values, SubmitReturn> {
  submit: Submit<Values, SubmitReturn>
  submitting: boolean | undefined
  submitSucceeded: boolean
  submitFailed: boolean
  defaultError: string | undefined
  dirty: boolean
  pristine: boolean
  valid: boolean
  invalid: boolean
  onFieldsChange: () => void
  form: FormInstance
}

const checkValid = every<FieldError>(flow(prop('errors'), size, eq(0)));

export default function useFormHook<Values, SubmitReturn>(
  onSubmit: OnSubmit<Values, SubmitReturn>,
  deps = [],
  checkEditing = false,
  visible = false,
): Result<Values, SubmitReturn> {
  const [form] = useForm<Values>();
  const [dirty, setDirty] = useState(form.isFieldsTouched());
  const [valid, setValid] = useState(checkValid(form.getFieldsError()));
  const onFieldsChange = useCallback(() => {
    setDirty(form.isFieldsTouched());
    setValid(checkValid(form.getFieldsError()));
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [defaultError, setDefaultError] = useState<string>();
  useIsFormEditing({ dirty, submitSucceeded, checkEditing, visible });

  return {
    submit: useCallback(async () => {
      try {
        setSubmitting(true);
        const values = await form.validateFields();
        const result = await onSubmit(values, form);
        setSubmitting(false);
        setDefaultError(undefined);
        setSubmitSucceeded(true);
        setSubmitFailed(false);
        return result;
      } catch (e) {
        console.warn('Submission error:', e);
        setSubmitting(false);
        if (e instanceof Array) {
          setDefaultError(find(propEq('field', 'default'))(e));
        }
        setSubmitSucceeded(false);
        setSubmitFailed(true);
        if (isArray(e) && form) {
          form.setFields(map(({ field, message }) => ({ name: field, errors: [message] }))(e));
        }
        return null;
      }
    }, [onSubmit, form, ...deps]),
    submitting,
    submitSucceeded,
    submitFailed,
    defaultError,
    onFieldsChange,
    dirty,
    pristine: !dirty,
    valid,
    invalid: !valid,
    form,
  };
}
