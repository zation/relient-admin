/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import { Form, Button } from 'antd';
import {
  func,
  object,
  shape,
  string,
  oneOfType,
  bool,
  any,
  array, arrayOf,
} from 'prop-types';
import { map } from 'lodash/fp';
import arrayMutators from 'final-form-arrays';
import useI18N from '../hooks/use-i18n';
import useSubmit from '../hooks/use-submit';
import useIsFormEditing from '../hooks/use-is-form-editing';
import Error from './form-error';
import Field from './field';

const { Item } = Form;

const result = ({
  initialValues,
  onSubmit,
  fields,
  getFields,
  checkEditing,
}) => {
  const submit = useSubmit(onSubmit);
  const i18n = useI18N();

  return (
    <FinalForm onSubmit={submit} initialValues={initialValues} mutators={{ ...arrayMutators }}>
      {({ handleSubmit, form }) => {
        const {
          dirty,
          submitSucceeded,
          submitting,
          pristine,
          submitError,
        } = form.getState();
        useIsFormEditing({ dirty, submitSucceeded, checkEditing });
        return (
          <Form onSubmit={handleSubmit}>
            <Error errors={submitError} />

            {map((field) => (
              <Field key={field.name} {...field} />))(fields || getFields(form))}

            <Item wrapperCol={{ span: 10, offset: 8 }}>
              <Button
                size="large"
                htmlType="submit"
                onClick={handleSubmit}
                style={{ marginRight: 10 }}
                type="primary"
                loading={submitting}
                disabled={pristine}
              >
                {i18n('submit')}
              </Button>
              <Button size="large" htmlType="button" onClick={form.reset}>
                {i18n('reset')}
              </Button>
            </Item>
          </Form>
        );
      }}
    </FinalForm>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  initialValues: object,
  fields: arrayOf(shape({
    name: string,
    label: string,
    htmlType: string,
    options: array,
    placeholder: string,
    validate: oneOfType([func, array]),
    required: bool,
    isArray: bool,
    component: any,
    fields: array,
  })),
  getFields: func,
  layout: object,
  checkEditing: bool,
};

result.displayName = __filename;

export default result;
