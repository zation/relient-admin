import { object, bool, string, node } from 'prop-types';
import React from 'react';
import { Form, Checkbox } from 'antd';
import useFieldInfo from '../../hooks/use-field-info';

const { Item } = Form;

const result = ({
  input: { onChange },
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  required,
  disabled,
  tips,
}) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, tips });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
    >
      <Checkbox onChange={onChange} disabled={disabled}>{label}</Checkbox>
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
  tips: string,
};

result.displayName = __filename;

export default result;
