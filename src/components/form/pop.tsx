/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useCallback,
  useEffect,
} from 'react';
import {
  Button,
  Drawer,
  Form,
  Modal,
} from 'antd';
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
import type { FormInstance } from 'antd/es/form';
import type { DrawerProps } from 'antd/es/drawer';
import type { ModalProps } from 'antd/es/modal';
import { useI18N } from 'relient/i18n';
import useForm, { OnSubmit, Submit } from '../../hooks/use-form';
import Error from './error';
import Field, { FieldProps } from './field';

export interface FooterParams {
  onCancel?: () => void
  form: FormInstance
  submit?: Submit
}

export interface FormPopProps extends Omit<DrawerProps, 'getContainer'>, Omit<ModalProps, 'getContainer'> {
  onSubmit: OnSubmit
  visible: boolean
  initialValues?: any
  onClose: () => void
  onCancel?: () => void
  fields?: FieldProps[]
  getFields?: (form: FormInstance) => FieldProps[]
  component?: ReactComponentLike
  width?: number
  checkEditing?: boolean
  footer?: (params: FooterParams) => ReactNodeLike
  levelMove?: number
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
  ...props
}: FormPopProps) => {
  const {
    submit,
    submitting,
    defaultError,
    invalid,
    pristine,
    onFieldsChange,
    form,
  } = useForm(onSubmit, [], checkEditing, true);
  const i18n = useI18N();
  const values = form.getFieldsValue();
  const onSubmitClick = useCallback(() => submit(values), [values]);

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
        onClick={onSubmitClick}
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
    <Form initialValues={initialValues} form={form} onFieldsChange={onFieldsChange}>
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
  onClose: func.isRequired,
};

result.displayName = __filename;

export default result;
