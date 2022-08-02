/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useCallback,
} from 'react';
import {
  Form,
  Button,
  FormInstance,
} from 'antd';
import {
  func,
  object,
  bool,
  array,
} from 'prop-types';
import { map } from 'lodash/fp';
import { useI18N } from 'relient/i18n';
import useForm, { OnSubmit } from '../../hooks/use-form';
import Error from './error';
import Field, { FieldProps } from './field';

const { Item } = Form;

export interface FormProps<Values, SubmitReturn> {
  initialValues?: Partial<Values>
  onSubmit: OnSubmit<Values, SubmitReturn>
  fields?: FieldProps[]
  getFields?: (form: FormInstance<Values>) => FieldProps[]
  checkEditing?: boolean
}

function result<Values, SubmitReturn>({
  initialValues,
  onSubmit,
  fields,
  getFields,
  checkEditing,
}: FormProps<Values, SubmitReturn>) {
  const {
    submit,
    submitting,
    defaultError,
    invalid,
    pristine,
    onFieldsChange,
    form,
  } = useForm(onSubmit, [], checkEditing, true);
  const i18n = useI18N();
  const reset = useCallback(() => form.resetFields(), [form.resetFields]);

  return (
    <Form onFinish={submit} form={form} initialValues={initialValues} onFieldsChange={onFieldsChange}>
      <Error error={defaultError} />

      {map(
        (field: FieldProps) => {
          const { name, label } = field;
          let key = '';
          if (name) {
            key = name.toString();
          } else if (label) {
            key = label.toString();
          }
          return <Field key={key} {...field} />;
        },
      )(fields || (getFields && getFields(form)))}

      <Item wrapperCol={{ span: 10, offset: 8 }}>
        <Button
          size="large"
          htmlType="submit"
          style={{ marginRight: 10 }}
          type="primary"
          loading={submitting}
          disabled={invalid || pristine}
        >
          {i18n('submit')}
        </Button>
        <Button size="large" htmlType="button" onClick={reset}>
          {i18n('reset')}
        </Button>
      </Item>
    </Form>
  );
}

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
