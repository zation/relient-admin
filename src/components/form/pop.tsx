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
  oneOfType,
  elementType,
  ReactComponentLike,
} from 'prop-types';
import { map } from 'lodash/fp';
import { useI18N } from 'relient/i18n';
import useForm, {
  OnSubmit,
  Submit,
} from '../../hooks/use-form';
import Error from './error';
import Field, { FieldProps } from './field';

export interface FooterParams<Values, SubmitReturn> {
  onCancel?: () => void
  form: FormInstance<Values>
  submit?: Submit<Values, SubmitReturn>
}

export interface FormPopProps<Values, SubmitReturn>
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
  getFooter?: (params: FooterParams<Values, SubmitReturn>) => ReactNode
  levelMove?: number
}

function result<Values, SubmitReturn>({
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
  const i18n = useI18N();

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
        {i18n('cancel')}
      </Button>
      <Button
        htmlType="submit"
        style={{ marginLeft: 20 }}
        type="primary"
        loading={submitting}
        disabled={invalid || pristine}
      >
        {i18n('submit')}
      </Button>
    </div>
  );
  const children = (
    <Form initialValues={initialValues} form={form} onFieldsChange={onFieldsChange} onFinish={submit}>
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
      width={width}
      {...props}
    >
      {children}
    </Modal>
  );
}

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
  onClose: func.isRequired,
};

result.displayName = __filename;

export default result;
