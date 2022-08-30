/* eslint-disable react/jsx-props-no-spreading */
import React, {
  Attributes,
  createElement,
  isValidElement,
} from 'react';
import {
  string,
  node,
  func,
  ReactComponentLike,
  ReactNodeLike,
  elementType,
  oneOfType,
  number,
  arrayOf,
} from 'prop-types';
import {
  omit,
  pick,
} from 'lodash/fp';
import {
  Form,
  Input,
} from 'antd';
import type {
  ValidatorRule,
  NamePath,
} from 'rc-field-form/es/interface';
import type {
  FormListFieldData,
  FormListProps,
} from 'antd/es/form/FormList';
import type { FormItemProps } from 'antd/es/form';
import {
  labelCol,
  wrapperCol,
} from '../../constants/default-field-layout';

const { Item, List } = Form;

export interface FieldProps<Values = any> extends Omit<FormItemProps<Values>, 'children'>, Attributes {
  component?: ReactComponentLike
  name: NamePath
  children?: FormListProps['children']
  element?: ReactNodeLike
  getLabel?: (formListFieldData: FormListFieldData, index: number) => ReactNodeLike
}

const itemPropKeys = [
  'colon',
  'dependencies',
  'extra',
  'getValueFromEvent',
  'getValueProps',
  'hasFeedback',
  'help',
  'hidden',
  'htmlFor',
  'initialValue',
  'label',
  'labelAlign',
  'labelCol',
  'messageVariables',
  'name',
  'normalize',
  'noStyle',
  'preserve',
  'required',
  'rules',
  'shouldUpdate',
  'tooltip',
  'trigger',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'valuePropName',
  'wrapperCol',
];

const result = ({
  children,
  component = Input,
  element,
  getLabel,
  ...field
}: FieldProps) => {
  const itemProps = pick(itemPropKeys, field);
  const componentProps = omit(itemPropKeys, field);

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

  return children ? (
    <List initialValue={field.initialValue} name={field.name} rules={field.rules as ValidatorRule[]}>
      {children}
    </List>
  ) : (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      {...itemProps}
    >
      {createElement(component, componentProps)}
    </Item>
  );
};

result.propTypes = {
  component: elementType,
  name: oneOfType([string, number, arrayOf(oneOfType([string, number]))]),
  element: node,
  getLabel: func,
};

result.displayName = __filename;

export default result;
