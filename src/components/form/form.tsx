/* eslint-disable react/jsx-props-no-spreading */
import React, {
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import {
  Form,
  Button,
  FormInstance,
  FormProps as AntdFormProps,
} from 'antd';
import {
  func,
  object,
  bool,
  array,
} from 'prop-types';
import { map } from 'lodash/fp';
import useForm, { OnSubmit } from '../../hooks/use-form';
import Error from './error';
import Field, { FieldProps } from './field';
import {
  defaultLabelCol,
  defaultWrapperCol,
} from '../../constants/default-field-layout';
import { Context } from '../../context';

const { Item } = Form;

export interface FormProps<Values, SubmitReturn = any> extends AntdFormProps<Values> {
  initialValues?: Partial<Values>
  onSubmit: OnSubmit<Values, SubmitReturn>
  fields?: FieldProps[]
  getFields?: (form: FormInstance<Values>) => FieldProps[]
  checkEditing?: boolean
  submitText?: string
  resetText?: string
}

function RelientForm<Values, SubmitReturn = any>({
  initialValues,
  onSubmit,
  fields,
  getFields,
  checkEditing,
  submitText,
  resetText,
  labelCol = defaultLabelCol,
  wrapperCol = defaultWrapperCol,
  name,
}: FormProps<Values, SubmitReturn>) {
  const {
    submit,
    submitting,
    defaultError,
    invalid,
    pristine,
    onFieldsChange,
    form,
  } = useForm(onSubmit, checkEditing, true);
  const reset = useCallback(() => form.resetFields(), [form.resetFields]);
  const { locale } = useContext(Context);

  return (
    <Form<Values>
      onFinish={submit}
      form={form}
      initialValues={initialValues}
      onFieldsChange={onFieldsChange}
      name={name}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
    >
      <Error error={defaultError} />

      {map<FieldProps, ReactNode>(
        (field) => (<Field key={field.name.toString()} {...field} />),
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
          {submitText || locale.submit}
        </Button>
        <Button size="large" htmlType="button" onClick={reset}>
          {resetText || locale.reset}
        </Button>
      </Item>
    </Form>
  );
}

RelientForm.propTypes = {
  onSubmit: func.isRequired,
  initialValues: object,
  fields: array,
  getFields: func,
  layout: object,
  checkEditing: bool,
};

export default RelientForm;
