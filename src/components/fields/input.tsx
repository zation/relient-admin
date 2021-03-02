import React, { createElement, ReactNode } from 'react';
import { object, string, bool, node, oneOf, any } from 'prop-types';
import { Form, Input } from 'antd';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import type { InputProps } from 'antd/es/input';
import type { LiteralUnion } from 'antd/es/_util/type';
import { Style } from '../interface';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Password } = Input;
const { Item } = Form;

export interface InputFieldProps extends InputProps {
  input: FieldInputProps<string | undefined>
  meta: FieldMetaState<string | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  placeholder?: string
  htmlType: LiteralUnion<'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden'
  | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text'
  | 'time' | 'url' | 'week', string>
  inputStyle: Style
}

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  placeholder,
  htmlType,
  required,
  disabled,
  inputStyle,
  prefix,
  size,
  suffix,
  addonAfter,
  addonBefore,
  autoComplete,
  extra,
}: InputFieldProps) => {
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
      {createElement(htmlType === 'password' ? Password : Input, {
        type: htmlType,
        placeholder,
        disabled,
        style: inputStyle,
        prefix,
        size,
        suffix,
        addonAfter,
        addonBefore,
        autoComplete,
        ...input,
      })}
    </Item>
  );
};

result.propTypes = {
  input: any.isRequired,
  meta: object.isRequired,
  layout: any,
  label: string,
  placeholder: string,
  htmlType: string.isRequired,
  required: bool,
  disabled: bool,
  inputStyle: any,
  prefix: node,
  suffix: node,
  size: oneOf(['small', 'middle', 'large']),
  addonAfter: node,
  addonBefore: node,
  autoComplete: string,
  extra: node,
};

result.displayName = __filename;

export default result;
