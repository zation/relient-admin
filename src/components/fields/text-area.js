/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { object, string, bool, func, oneOfType } from 'prop-types';
import { Form, Input } from 'antd';
import useFieldInfo from '../../hooks/use-field-info';

const { Item } = Form;
const { TextArea } = Input;

const result = ({
  input,
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  tips,
  placeholder,
  required,
  disabled,
  inputStyle,
  onPressEnter,
  autosize,
}) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, tips });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={label}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
    >
      <TextArea
        {...input}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        onPressEnter={onPressEnter}
        autosize={autosize}
      />
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  tips: string,
  placeholder: string,
  required: bool,
  disabled: bool,
  inputStyle: object,
  onPressEnter: func,
  autosize: oneOfType([bool, object]),
};

result.displayName = __filename;

export default result;
