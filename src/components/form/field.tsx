/* eslint-disable react/jsx-props-no-spreading */
import React, {
  createElement,
  isValidElement,
  ComponentType,
  ReactElement,
} from 'react';
import {
  string,
  node,
  func,
  elementType,
  oneOfType,
  number,
  arrayOf,
} from 'prop-types';
import {
  Form,
  Input,
} from 'antd';
import type {
  NamePath,
} from 'rc-field-form/es/interface';
import type {
  FormListProps,
} from 'antd/es/form/FormList';
import type { FormItemProps } from 'antd/es/form';
import {
  labelCol,
  wrapperCol,
} from '../../constants/default-field-layout';

const { Item, List } = Form;

export interface FieldProps<Values = any> extends Omit<FormItemProps<Values>, 'children'> {
  component?: ComponentType
  name: NamePath
  element?: ReactElement
  componentProps?: Record<string, any>
  listProps?: FormListProps
}

function RelientField({
  component = Input,
  element,
  componentProps,
  listProps,
  ...itemProps
}: FieldProps) {
  if (isValidElement(element)) {
    return (
      <Item
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        {...itemProps}
      >
        {element}
      </Item>
    );
  }

  return listProps ? createElement(List, listProps) : (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      {...itemProps}
    >
      {createElement(component, componentProps)}
    </Item>
  );
}

RelientField.propTypes = {
  component: elementType,
  name: oneOfType([string, number, arrayOf(oneOfType([string, number]))]),
  element: node,
  getLabel: func,
};

export default RelientField;
