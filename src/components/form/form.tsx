/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { Form, Button } from 'antd';
import {
  func,
  object,
  bool,
  array,
} from 'prop-types';
import { map } from 'lodash/fp';
import type { FormInstance } from 'antd/es/form';
import { useI18N } from 'relient/i18n';
import useSubmit, { OnSubmit } from '../../hooks/use-submit';
import useIsFormEditing from '../../hooks/use-is-form-editing';
import Error from './error';
import Field, { FieldProps } from './field';

const { Item, useForm } = Form;

export interface FormProps {
  initialValues?: any
  onSubmit: OnSubmit
  fields?: FieldProps[]
  getFields?: (form: FormInstance) => FieldProps[]
  checkEditing?: boolean
}

const result = ({
  initialValues,
  onSubmit,
  fields,
  getFields,
  checkEditing,
}: FormProps) => {
  const [form] = useForm();
  const { submit, submitting, submitSucceeded, defaultError } = useSubmit(onSubmit, [], form);
  const i18n = useI18N();
  const pristine = form.isFieldsTouched();
  const reset = useCallback(() => form.resetFields(), [form.resetFields]);
  useIsFormEditing({ dirty: !pristine, submitSucceeded, checkEditing });

  return (
    <Form onFinish={submit} form={form} initialValues={initialValues}>
      <Error error={defaultError} />

      {map(
        (field: FieldProps) => (<Field key={field.name.toString()} {...field} />),
      )(fields || (getFields && getFields(form)))}

      <Item wrapperCol={{ span: 10, offset: 8 }}>
        <Button
          size="large"
          htmlType="submit"
          style={{ marginRight: 10 }}
          type="primary"
          loading={submitting}
          disabled={pristine}
        >
          {i18n('submit')}
        </Button>
        <Button size="large" htmlType="button" onClick={reset}>
          {i18n('reset')}
        </Button>
      </Item>
    </Form>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  initialValues: object,
  fields: array,
  getFields: func,
  layout: object,
  checkEditing: bool,
};

result.displayName = __filename;

export default result;
