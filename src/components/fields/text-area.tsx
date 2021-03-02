/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode } from 'react';
import { object, string, bool, func, oneOfType, node } from 'prop-types';
import { Form, Input } from 'antd';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input/TextArea';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';
import { Style } from '../interface';

const { Item } = Form;
const { TextArea } = Input;

export interface TextAreaProps extends Pick<AntdTextAreaProps, 'onPressEnter' | 'autoSize' | 'placeholder'> {
  input: FieldInputProps<string | undefined>
  meta: FieldMetaState<string | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  inputStyle: Style
}

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  extra,
  placeholder,
  required,
  disabled,
  inputStyle,
  onPressEnter,
  autoSize,
}: TextAreaProps) => {
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
      <TextArea
        {...input}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        onPressEnter={onPressEnter}
        autoSize={autoSize}
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
  placeholder: string,
  required: bool,
  disabled: bool,
  inputStyle: object,
  onPressEnter: func,
  autoSize: oneOfType([bool, object]),
};

result.displayName = __filename;

export default result;
