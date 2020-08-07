/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
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
import arrayMutators from 'final-form-arrays';
import useI18N from '../hooks/use-i18n';
import useSubmit from '../hooks/use-submit';
import useIsFormEditing from '../hooks/use-is-form-editing';
import Error from './form-error';
import Field from './field';

const result = ({
  onSubmit,
  visible,
  close,
  onClose,
  onCancel,
  fields,
  getFields,
  initialValues,
  component,
  width = 540,
  checkEditing,
  footer,
  decorators,
  keepDirtyOnReinitialize,
  levelMove = 370,
  validate,
  afterVisibleChange,
  afterClose,
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
      mutators={{ ...arrayMutators }}
    >
      {({ handleSubmit, form }) => {
        const {
          dirty,
          submitSucceeded,
          submitting,
          pristine,
          submitError,
        } = form.getState();
        useIsFormEditing({ dirty, submitSucceeded, checkEditing, visible });
        const finalAfterVisibleChange = useCallback((open) => {
          if (afterVisibleChange) {
            afterVisibleChange(open);
          }
          if (!open) {
            form.restart();
          }
        }, [afterVisibleChange, form.restart]);
        const finalAfterClose = useCallback(() => {
          if (afterClose) {
            afterClose();
          }
          form.restart();
        }, [afterClose, form.restart]);
        const onCloseOrCancel = useCallback(() => {
          close();
          if (onCancel) {
            onCancel();
          }
          if (onClose) {
            onClose();
          }
        }, [close, onCancel, onClose]);
        const finalFooter = footer ? footer({ onCancel, form, handleSubmit }) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              htmlType="button"
              onClick={onCloseOrCancel}
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
              disabled={pristine}
            >
              {i18n('submit')}
            </Button>
          </div>
        );
        const children = (
          <Form onSubmit={handleSubmit}>
            <Error errors={submitError} />

            {map((field) => (
              <Field key={field.name} {...field} />))(fields || getFields(form))}
          </Form>
        );

        if (component === Drawer) {
          return (
            <Drawer
              visible={visible}
              footer={finalFooter}
              onClose={onCloseOrCancel}
              afterVisibleChange={finalAfterVisibleChange}
              width={width}
              levelMove={levelMove}
              {...props}
            >
              {children}
            </Drawer>
          );
        }

        return (
          <Modal
            visible={visible}
            footer={finalFooter}
            onCancel={onCloseOrCancel}
            afterClose={finalAfterClose}
            width={width}
            {...props}
          >
            {children}
          </Modal>
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
  visible: bool.isRequired,
  onCancel: func,
  width: number,
  component: oneOf([Drawer, Modal]).isRequired,
  footer: func,
  decorators: arrayOf(func),
  levelMove: oneOfType([number, array, func]),
  keepDirtyOnReinitialize: bool,
  validate: func,
  afterVisibleChange: func,
  afterClose: func,
  close: func.isRequired,
  onClose: func,
};

result.displayName = __filename;

export default result;
