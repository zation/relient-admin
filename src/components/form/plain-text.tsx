import React, { ReactNode } from 'react';
import {
  func,
  any,
} from 'prop-types';

export interface PlainTextProps {
  value: any,
  render?: (value: any) => ReactNode
}

const result = ({ value, render }: PlainTextProps) => (
  <span className="ant-form-text">{render ? render(value) : value}</span>
);

result.propTypes = {
  value: any,
  render: func,
};

result.displayName = __filename;

export default result;
