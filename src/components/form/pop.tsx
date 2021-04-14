/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { Button, Drawer, Form, Modal } from 'antd';
import {
  func,
  bool,
  array,
  object,
  number,
  oneOfType,
  elementType,
  ReactNodeLike,
  ReactComponentLike,
} from 'prop-types';
import { map } from 'lodash/fp';
import { FormInstance } from 'antd/es/form';
import { useI18N } from 'relient/i18n';
import useSubmit, { OnSubmit, Submit } from '../../hooks/use-submit';
import useIsFormEditing from '../../hooks/use-is-form-editing';
import Error from './error';
import Field, { FieldProps } from './field';

const { useForm } = Form;

export interface FooterParams {
  onCancel?: () => void
  form: FormInstance
  submit?: Submit
}

export interface FormPopProps {
  onSubmit: OnSubmit
  visible: boolean
  initialValues: any
  onClose: () => void
  onCancel?: () => void
  fields?: FieldProps[]
  getFields?: (form: FormInstance) => FieldProps[]
  component?: ReactComponentLike
  width?: number
  checkEditing?: boolean
  footer?: (params: FooterParams) => ReactNodeLike
  levelMove?: number
  afterVisibleChange?: (isOpen: boolean) => void
  afterClose?: () => void
}

const result = ({
  onSubmit,
  visible,
  onClose,
  onCancel,
  fields,
  getFields,
  initialValues,
  component,
  width = 540,
  checkEditing,
  footer,
  levelMove = 370,
  afterVisibleChange,
  afterClose,
  ...props
}: FormPopProps) => {
  const [form] = useForm();
  const pristine = form.isFieldsTouched();
  const { submit, submitting, submitSucceeded, defaultError } = useSubmit(onSubmit, form);
  const i18n = useI18N();

  useIsFormEditing({ dirty: pristine, submitSucceeded, checkEditing, visible });
  const finalAfterVisibleChange = useCallback((isOpen) => {
    if (afterVisibleChange) {
      afterVisibleChange(isOpen);
    }
    if (!isOpen) {
      form.resetFields();
    }
  }, [afterVisibleChange, form.resetFields]);
  const finalAfterClose = useCallback(() => {
    if (afterClose) {
      afterClose();
    }
    form.resetFields();
  }, [afterClose, form.resetFields]);
  const onCloseOrCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  }, [onCancel, onClose]);
  const finalFooter = footer ? footer({ onCancel, form, submit }) : (
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
        onClick={submit}
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
    <Form onFinish={submit} initialValues={initialValues} form={form}>
      <Error error={defaultError} />

      {map(
        (field: FieldProps) => (<Field key={field.name.toString()} {...field} />),
      )(fields || (getFields && getFields(form)))}
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
        // @ts-ignore
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
};

result.propTypes = {
  onSubmit: func.isRequired,
  initialValues: object,
  fields: array,
  getFields: func,
  layout: object,
  checkEditing: bool,
  visible: bool.isRequired,
  onCancel: func,
  width: number,
  component: elementType.isRequired,
  footer: func,
  levelMove: oneOfType([number, array, func]),
  afterVisibleChange: func,
  afterClose: func,
  onClose: func.isRequired,
};

result.displayName = __filename;

export default result;
