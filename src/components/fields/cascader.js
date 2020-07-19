/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { object, string, bool, array, node, func } from 'prop-types';
import { Form, Cascader } from 'antd';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  required,
  disabled,
  showSearch,
  displayRender,
  options,
  size,
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
      <Cascader
        options={options}
        showSearch={showSearch}
        disabled={disabled}
        size={size}
        allowClear={false}
        displayRender={displayRender}
        {...input}
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
  matchInputWidth: bool,
  showSearch: bool,
  displayRender: func,
  options: array,
  size: string,
  extra: node,
};

result.displayName = __filename;

export default result;
