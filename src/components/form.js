/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { Form, Button, Alert } from 'antd';
import {
  func,
  object,
  arrayOf,
  shape,
  string,
  oneOfType,
  bool,
  any,
  array,
} from 'prop-types';
import { map, isFunction } from 'lodash/fp';
import useI18N from '../hooks/use-i18n';
import Input from './fields/input';
import useSubmit from '../hooks/use-submit';

const { Item } = Form;
const defaultLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const result = ({
  initialValues,
  onSubmit,
  fields,
  layout = defaultLayout,
  checkEditing,
}) => {
  const submit = useSubmit(onSubmit);
  const i18n = useI18N();

  return (
    <FinalForm onSubmit={submit} initialValues={initialValues}>
      {({ handleSubmit, submitting, form, submitError }) => {
        const { dirty, submitSucceeded } = form.getState();
        useEffect(() => {
          global.isFormEditing = checkEditing && dirty && !submitSucceeded;
          return () => {
            global.isFormEditing = false;
          };
        }, [dirty, submitSucceeded, checkEditing]);
        return (
          <Form onSubmit={handleSubmit}>
            {submitError && (
              <Alert
                style={{ marginBottom: 20 }}
                message={submitError.length > 1
                  ? (
                    <ul style={{ margin: 0 }}>
                      {map((error) => <li>{error}</li>)(submitError)}
                    </ul>
                  ) : submitError[0]}
                type="warning"
              />
            )}

            {map((field) => {
              const { name, htmlType = 'text', ...rest } = isFunction(field) ? field({ form }) : field;
              return (
                <Field
                  key={name}
                  name={name}
                  htmlType={htmlType}
                  component={Input}
                  size="large"
                  layout={layout}
                  {...rest}
                />
              );
            })(fields)}
            <Item wrapperCol={{ span: 10, offset: 8 }}>
              <Button
                size="large"
                htmlType="submit"
                onClick={handleSubmit}
                style={{ marginRight: 10 }}
                type="primary"
                loading={submitting}
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
  fields: arrayOf(oneOfType([
    shape({
      name: string.isRequired,
      label: string.isRequired,
      htmlType: string,
      options: array,
      placeholder: string,
      validate: oneOfType([func, array]),
      required: bool,
      component: any,
    }),
    func,
  ])),
  layout: object,
  checkEditing: bool,
};

result.displayName = __filename;

export default result;
