import { object, bool, node } from 'prop-types';
import React from 'react';
import { Form, Checkbox } from 'antd';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

const result = ({
  input: { onChange },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  required,
  disabled,
  extra,
}) => {
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
  extra: node,
};

result.displayName = __filename;

export default result;
