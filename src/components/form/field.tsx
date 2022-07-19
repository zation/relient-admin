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
import type { FormListFieldData, FormListProps } from 'antd/es/form/FormList';
import type { FormItemProps } from 'antd/es/form';
import { useI18N } from 'relient/i18n';
import {
  labelCol,
  wrapperCol,
} from '../../constants/default-field-layout';

const { Item, List } = Form;

export interface FieldProps extends Omit<FormItemProps, 'children'>, Attributes {
  component: ReactComponentLike
  name: NamePath
  children?: FormListProps['children']
  element: ReactNodeLike
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
  const i18n = useI18N();
  const itemProps = pick(itemPropKeys, field);
  const componentProps = omit(itemPropKeys, field);
  const label = typeof itemProps.label === 'string' ? i18n(itemProps.label) : itemProps.label;

  if (isValidElement(element)) {
    return (
      <Item
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        {...itemProps}
        label={label}
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
      label={label}
    >
      {createElement(component, componentProps)}
    </Item>
  );
};

result.propTypes = {
  component: elementType,
  name: string,
  element: node,
  getLabel: func,
};

result.displayName = __filename;

export default result;
