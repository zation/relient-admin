import React, { createElement } from 'react';
import { Button, Drawer, Form, Modal } from 'antd';
import {
  func,
  bool,
  array,
  object,
  number,
  oneOf,
  shape,
  string,
  oneOfType,
  any,
  arrayOf,
} from 'prop-types';
import { map } from 'lodash/fp';
import { Form as FinalForm } from 'react-final-form';
import useI18N from '../hooks/use-i18n';
import useSubmit from '../hooks/use-submit';
import useIsFormEditing from '../hooks/use-is-form-editing';
import Error from './form-error';
import Field from './field';

const result = ({
  onSubmit,
  visible,
  onCancel,
  fields,
  getFields,
  initialValues,
  component,
  width = 528,
  checkEditing,
  footer,
  decorators,
  keepDirtyOnReinitialize,
  levelMove = 370,
  validate,
  ...props
}) => {
  const submit = useSubmit(onSubmit);
  const i18n = useI18N();

  return (
    <FinalForm
      onSubmit={submit}
      initialValues={initialValues}
      decorators={decorators}
      keepDirtyOnReinitialize={keepDirtyOnReinitialize}
      validate={validate}
    >
      {({ handleSubmit, form }) => {
        const {
          dirty,
          submitSucceeded,
          submitting,
          pristine,
          hasValidationErrors,
          submitError,
        } = form.getState();
        useIsFormEditing({ dirty, submitSucceeded, checkEditing, visible });

        return createElement(component, {
          visible,
          maskClosable: false,
          footer: footer ? footer({ onCancel, form, handleSubmit }) : (
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
          levelMove,
          ...props,
        }, (
          <Form onSubmit={handleSubmit}>
            <Error errors={submitError} />

            {map((field) => (
              <Field key={field.name} form={form} {...field} />),
            )(fields || getFields(form))}
          </Form>
        ));
      }}
    </FinalForm>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  initialValues: object,
  fields: arrayOf(shape({
    name: string.isRequired,
    label: string.isRequired,
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
  visible: bool.isRequired,
  onCancel: func.isRequired,
  width: number,
  component: oneOf([Drawer, Modal]).isRequired,
  footer: func,
  decorators: arrayOf(func),
  levelMove: oneOfType([number, array, func]),
  keepDirtyOnReinitialize: bool,
  validate: func,
};

result.displayName = __filename;

export default result;
