import React, { ReactNode } from 'react';
import {
  func,
  any,
} from 'prop-types';

export interface PlainTextProps {
  value: any,
  render?: (value: any) => ReactNode
}

function RelientPlainText({ value, render }: PlainTextProps) {
  return <span className="ant-form-text">{render ? render(value) : value}</span>;
}

RelientPlainText.propTypes = {
  value: any,
  render: func,
};

export default RelientPlainText;
