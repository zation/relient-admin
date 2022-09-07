import {
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

const { Item, List } = Form;

export interface FieldProps extends Omit<FormItemProps, 'children'> {
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
    return createElement(Item, itemProps, element);
  }

  return listProps
    ? createElement(List, listProps)
    : createElement(Item, itemProps, createElement(component, componentProps));
}

RelientField.propTypes = {
  component: elementType,
  name: oneOfType([string, number, arrayOf(oneOfType([string, number]))]),
  element: node,
  getLabel: func,
};

export default RelientField;
