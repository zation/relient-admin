import { object, string, func } from 'prop-types';
import React from 'react';
import { Form } from 'antd';
import { identity } from 'lodash/fp';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

const result = ({
  input: { value } = {},
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  tips,
  render = identity,
  renderContent,
}) => (
  <Item
    labelCol={labelCol}
    wrapperCol={wrapperCol}
    label={label}
    help={tips}
  >
    {renderContent ? renderContent(value) : (
      <span className="ant-form-text">{render ? render(value) : value}</span>)}
  </Item>
);

result.propTypes = {
  input: object,
  layout: object,
  label: string,
  tips: string,
  renderContent: func,
  render: func,
};

result.displayName = __filename;

export default result;
