import { object, string, func, node } from 'prop-types';
import React from 'react';
import { Form } from 'antd';
import { identity, isUndefined } from 'lodash/fp';

const { Item } = Form;

const result = ({
  input: { value } = {},
  layout: { wrapperCol, labelCol } = {},
  label,
  tips,
  render = identity,
  value: constValue,
  renderContent,
}) => (
  <Item
    labelCol={labelCol}
    wrapperCol={wrapperCol}
    label={label}
    help={tips}
  >
    {renderContent ? renderContent(constValue) : (
      <span className="ant-form-text">{isUndefined(constValue) ? render(value) : constValue}</span>)}
  </Item>
);

result.propTypes = {
  input: object,
  layout: object,
  label: string,
  tips: string,
  renderContent: func,
  render: func,
  value: node,
};

result.displayName = __filename;

export default result;
