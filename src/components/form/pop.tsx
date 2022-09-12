/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  Button,
  Drawer,
  Form,
  Modal,
  FormInstance,
  DrawerProps,
  ModalProps,
  FormProps,
} from 'antd';
import {
  func,
  bool,
  array,
  object,
  number,
  any,
  oneOf,
} from 'prop-types';
import {
  map,
} from 'lodash/fp';
import useForm, {
  OnSubmit,
  Submit,
} from '../../hooks/use-form';
import Error from './error';
import Field, { FieldProps } from './field';
import {
  defaultLabelCol,
  defaultWrapperCol,
} from '../../constants/default-field-layout';

export interface FooterParams<Values, SubmitReturn = any> {
  onCancel?: () => void
  form: FormInstance<Values>
  submit?: Submit<SubmitReturn>
}

export interface FormPopProps<Values, SubmitReturn = any> extends Omit<DrawerProps, 'getContainer'>,
  Omit<ModalProps, 'getContainer'>,
  Pick<FormProps<Values>, 'labelCol' | 'wrapperCol' | 'name'> {
  onSubmit: OnSubmit<Values, SubmitReturn>
  open: boolean
  initialValues?: Partial<Values>
  onClose: () => void
  onCancel?: () => void
  fields?: FieldProps[]
  getFields?: (form: FormInstance<Values>) => FieldProps[]
  component?: 'drawer' | 'modal'
  width?: number
  checkEditing?: boolean
  getFooter?: (params: FooterParams<Values, SubmitReturn | undefined>) => ReactNode
  cancelText?: string
  submitText?: string
}

function RelientFormPop<Values, SubmitReturn = any>({
  onSubmit,
  open,
  onClose,
  onCancel,
  fields,
  getFields,
  initialValues,
  component,
  width = 540,
  checkEditing,
  getFooter,
  submitText = '提交',
  cancelText = '取消',
  labelCol = defaultLabelCol,
  wrapperCol = defaultWrapperCol,
  name,
  ...props
}: FormPopProps<Values, SubmitReturn>) {
  const {
    submit,
    reset,
    submitting,
    defaultError,
    invalid,
    pristine,
    onFieldsChange,
    form,
  } = useForm<Values, SubmitReturn>(onSubmit, checkEditing, true);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);
  const onCloseOrCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  }, [onCancel, onClose]);
  const finalFooter = getFooter ? getFooter({ onCancel, form, submit }) : (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        htmlType="button"
        onClick={onCloseOrCancel}
        type="primary"
        ghost
      >
        {cancelText}
      </Button>
      <Button
        htmlType="button"
        style={{ marginLeft: 20 }}
        type="primary"
        loading={submitting}
        disabled={invalid || pristine}
        onClick={submit}
      >
        {submitText}
      </Button>
    </div>
  );
  const children = (
    <Form<Values>
      initialValues={initialValues}
      form={form}
      onFieldsChange={onFieldsChange}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      name={name}
    >
      <Error error={defaultError} />

      {map<FieldProps, ReactNode>(
        (field) => (<Field key={field.name.toString()} {...field} />),
      )(fields || (getFields && getFields(form)))}
    </Form>
  );

  if (component === 'drawer') {
    return (
      <Drawer
        forceRender
        open={open}
        footer={finalFooter}
        onClose={onCloseOrCancel}
        width={width}
        {...props}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Modal
      forceRender
      open={open}
      footer={finalFooter}
      onCancel={onCloseOrCancel}
      width={width}
      {...props}
    >
      {children}
    </Modal>
  );
}

// NOTICE: conflict with ts
RelientFormPop.propTypes = {
  onSubmit: func.isRequired,
  initialValues: any,
  fields: array,
  getFields: func,
  layout: object,
  checkEditing: bool,
  open: bool.isRequired,
  onCancel: func,
  width: number,
  component: oneOf<'modal' | 'drawer'>(['modal', 'drawer']),
  getFooter: func,
  onClose: func.isRequired,
};

export default RelientFormPop;
