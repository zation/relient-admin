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
  autoComplete,
  extra,
}) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, tips, submitError });

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
      {extra}
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
  autoComplete: string,
  extra: node,
};

result.displayName = __filename;

export default result;
