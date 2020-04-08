/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, createElement } from 'react';
import { Alert, Button, Drawer, Form, Modal } from 'antd';
import { func, bool, array, object, number, oneOf } from 'prop-types';
import { isFunction, map } from 'lodash/fp';
import { Field, Form as FinalForm } from 'react-final-form';
import Input from './fields/input';
import useI18N from '../hooks/use-i18n';
import useSubmit from '../hooks/use-submit';

const defaultLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const result = ({
  onSubmit,
  visible,
  onCancel,
  fields,
  initialValues,
  type,
  layout = defaultLayout,
  width = 528,
  checkEditing,
  ...props
}) => {
  const submit = useSubmit(onSubmit);
  const i18n = useI18N();

  return (
    <FinalForm onSubmit={submit} initialValues={initialValues}>
      {({ handleSubmit, submitting, form, submitError }) => {
        const { dirty, submitSucceeded, pristine, hasValidationErrors } = form.getState();
        useEffect(() => {
          global.isFormEditing = checkEditing && dirty && !submitSucceeded;
          return () => {
            global.isFormEditing = false;
          };
        }, [dirty, submitSucceeded, checkEditing]);

        return createElement(type, {
          destroyOnClose: true,
          visible,
          footer: (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                htmlType="button"
                onClick={onCancel}
                type="primary"
                ghost
              >
                {i18n('cancel')}
              </Button>
              <Button
                htmlType="submit"
                onClick={handleSubmit}
                style={{ marginLeft: 20 }}
                type="primary"
                loading={submitting}
                disabled={pristine || hasValidationErrors}
              >
                {i18n('submit')}
              </Button>
            </div>
          ),
          onClose: onCancel,
          onCancel,
          width,
          ...props,
        }, (
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
                  layout={layout}
                  {...rest}
                />
              );
            })(fields)}
          </Form>
        ));
      }}
    </FinalForm>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  visible: bool.isRequired,
  onCancel: func.isRequired,
  fields: array.isRequired,
  initialValues: object,
  layout: object,
  width: number,
  checkEditing: bool,
  type: oneOf([Drawer, Modal]),
};

result.displayName = __filename;

export default result;
