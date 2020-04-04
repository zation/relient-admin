import React from 'react';
import { string, object, bool } from 'prop-types';
import { Form, Switch } from 'antd';
import { getFieldInfo } from '../../utils';

const { Item } = Form;

const result = ({
  input: { onChange, value },
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  required,
  disabled,
  inputStyle,
  tips,
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
      <Switch
        checked={!!value}
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
  tips: string,
  required: bool,
  disabled: bool,
  inputStyle: object,
};

result.displayName = __filename;

export default result;
