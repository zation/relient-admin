import { object, bool, node } from 'prop-types';
import React, { ReactNode } from 'react';
import { Form, Checkbox } from 'antd';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

export interface CheckboxProps {
  input: FieldInputProps<boolean | undefined>
  meta: FieldMetaState<boolean | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
}

const result = ({
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  required,
  disabled,
  extra,
}: CheckboxProps) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
      extra={extra}
    >
      <Checkbox onChange={onChange} disabled={disabled} checked={value}>{label}</Checkbox>
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: node,
  required: bool,
  disabled: bool,
  extra: node,
};

result.displayName = __filename;

export default result;
