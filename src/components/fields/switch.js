import React from 'react';
import { string, object, bool, node } from 'prop-types';
import { Form, Switch } from 'antd';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

const result = ({
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  required,
  disabled,
  inputStyle,
  extra,
}) => {
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
  extra: node,
  required: bool,
  disabled: bool,
  inputStyle: object,
};

result.displayName = __filename;

export default result;
