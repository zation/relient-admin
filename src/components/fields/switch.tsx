import React, { ReactNode } from 'react';
import { string, object, bool, node } from 'prop-types';
import { Form, Switch } from 'antd';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

export interface SwitchProps {
  input: FieldInputProps<boolean | undefined>
  meta: FieldMetaState<boolean | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  inputStyle: { [key: string]: string | number | null | undefined }
}

const result = ({
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  required,
  disabled,
  inputStyle,
  extra,
}: SwitchProps) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={label}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
      extra={extra}
    >
      <Switch
        checked={value}
        onChange={onChange}
        disabled={disabled}
        style={inputStyle}
      />
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  extra: node,
  required: bool,
  disabled: bool,
  inputStyle: object,
};

result.displayName = __filename;

export default result;
