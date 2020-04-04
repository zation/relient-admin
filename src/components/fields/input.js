/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { object, string, bool, node } from 'prop-types';
import { Form, Input } from 'antd';
import { getFieldInfo } from '../../utils';

const { Item } = Form;

const result = ({
  input,
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  tips,
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
}) => {
  const { validateStatus, help } = getFieldInfo({ touched, error, tips });

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
      <Input
        type={htmlType}
        {...input}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        prefix={prefix}
        size={size}
        suffix={suffix}
        addonAfter={addonAfter}
        addonBefore={addonBefore}
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
  htmlType: string.isRequired,
  required: bool,
  disabled: bool,
  inputStyle: object,
  prefix: node,
  suffix: node,
  size: string,
  addonAfter: node,
  addonBefore: node,
};

result.displayName = __filename;

export default result;
