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
} from 'antd';
import {
  func,
  bool,
  array,
  object,
  number,
  elementType,
  ReactComponentLike,
  any,
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

export interface FooterParams<Values, SubmitReturn = void> {
  onCancel?: () => void
  form: FormInstance<Values>
  submit?: Submit<Values, SubmitReturn>
}

export interface FormPopProps<Values, SubmitReturn = void>
  extends Omit<DrawerProps, 'getContainer'>, Omit<ModalProps, 'getContainer'> {
  onSubmit: OnSubmit<Values, SubmitReturn>
  visible: boolean
  initialValues?: Partial<Values>
  onClose: () => void
  onCancel?: () => void
  fields?: FieldProps[]
  getFields?: (form: FormInstance<Values>) => FieldProps[]
  component?: ReactComponentLike
  width?: number
  checkEditing?: boolean
  getFooter?: (params: FooterParams<Values, SubmitReturn | undefined>) => ReactNode
  cancelText?: string
  submitText?: string
}

function RelientFormPop<Values, SubmitReturn = void>({
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
  getFooter,
  levelMove = 370,
  submitText = '提交',
  cancelText = '取消',
  ...props
}: FormPopProps<Values, SubmitReturn>) {
  const {
    submit,
    submitting,
    defaultError,
    invalid,
    pristine,
    onFieldsChange,
    form,
  } = useForm<Values, SubmitReturn>(onSubmit, [], checkEditing, true);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);
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
        htmlType="submit"
        style={{ marginLeft: 20 }}
        type="primary"
        loading={submitting}
        disabled={invalid || pristine}
      >
        {submitText}
      </Button>
    </div>
  );
  const children = (
    <Form<Values> initialValues={initialValues} form={form} onFieldsChange={onFieldsChange} onFinish={submit}>
      <Error error={defaultError} />

      {map(
        (field: FieldProps) => (<Field key={field.name.toString()} {...field} />),
      )(fields || (getFields && getFields(form)))}
    </Form>
  );

  if (component === Drawer) {
    return (
      <Drawer
        forceRender
        visible={visible}
        footer={finalFooter}
        onClose={onCloseOrCancel}
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
      forceRender
      visible={visible}
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
  visible: bool.isRequired,
  onCancel: func,
  width: number,
  component: elementType.isRequired,
  getFooter: func,
  onClose: func.isRequired,
};

export default RelientFormPop;
