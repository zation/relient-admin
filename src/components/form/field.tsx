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
  bool,
  array,
  ReactElementLike,
  ReactComponentLike,
} from 'prop-types';
import {
  map,
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
import type { FormListFieldData } from 'antd/es/form/FormList';
import type { FormItemProps } from 'antd/es/form';
import {
  labelCol,
  wrapperCol,
} from '../../constants/default-field-layout';

const { Item, List, ErrorList } = Form;

export interface FieldProps extends Omit<FormItemProps, 'children'>, Attributes {
  component: ReactComponentLike
  name: NamePath
  fields: FieldProps[]
  isArray?: boolean
  element: ReactElementLike
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
  isArray,
  component = Input,
  element,
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

  return isArray ? (
    <List initialValue={field.initialValue} name={field.name} rules={field.rules as ValidatorRule[]}>
      {(fields, _, { errors }) => (
        <>
          {map((antField: FormListFieldData) => (
            <Item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              {...itemProps}
              name={antField.name}
              fieldKey={antField.fieldKey}
              key={antField.key}
            >
              {createElement(component, componentProps)}
            </Item>
          ))(fields)}
          <ErrorList errors={errors} />
        </>
      )}
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
  name: string,
  element: node,
  isArray: bool,
  htmlType: string,
  onValueChange: func,
  parse: func,
  format: func,
  fields: array,
};

result.displayName = __filename;

export default result;
