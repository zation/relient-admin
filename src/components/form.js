/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { Form, Button } from 'antd';
import { func, object, arrayOf, shape, string, oneOfType, bool, any, array } from 'prop-types';
import { map, isFunction } from 'lodash/fp';
import Input from './fields/input';

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
}) => (
  <FinalForm onSubmit={onSubmit} initialValues={initialValues}>
    {({ handleSubmit, submitting, form }) => (
      <Form onSubmit={handleSubmit}>
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
            确认
          </Button>
          <Button size="large" htmlType="button" onClick={form.reset}>
            重置
          </Button>
        </Item>
      </Form>
    )}
  </FinalForm>
);

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
};

result.displayName = __filename;

export default result;
