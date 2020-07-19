import React, { createElement } from 'react';
import { object, string, bool, node } from 'prop-types';
import { Form, Input } from 'antd';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Password } = Input;
const { Item } = Form;

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
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
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
  autoComplete: string,
  extra: node,
};

result.displayName = __filename;

export default result;
