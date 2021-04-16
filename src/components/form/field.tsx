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
import { map, omit, pick } from 'lodash/fp';
import {
  Form,
  Input,
} from 'antd';
import type {
  ValidatorRule,
  NamePath,
} from 'rc-field-form/es/interface';
import type { FormListFieldData } from 'antd/es/form/FormList';
import { FormItemProps } from 'antd/es/form';

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
  if (isValidElement(element)) {
    return (
      <Item {...field}>
        {element}
      </Item>
    );
  }
  const itemProps = pick(itemPropKeys, field);
  const componentProps = omit(itemPropKeys, field);

  return isArray ? (
    <List initialValue={field.initialValue} name={field.name} rules={field.rules as ValidatorRule[]}>
      {(fields, _, { errors }) => (
        <>
          {map((antField: FormListFieldData) => (
            <Item {...itemProps} name={antField.name} fieldKey={antField.fieldKey} key={antField.key}>
              {createElement(component, componentProps)}
            </Item>
          ))(fields)}
          <ErrorList errors={errors} />
        </>
      )}
    </List>
  ) : (
    <Item {...itemProps}>
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
