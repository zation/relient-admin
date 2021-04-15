/* eslint-disable react/jsx-props-no-spreading */
import React, { Attributes, createElement, FC, isValidElement } from 'react';
import { string, node, func, bool, array, ReactElementLike } from 'prop-types';
import { map } from 'lodash/fp';
import { Form } from 'antd';
import type { ValidatorRule, NamePath } from 'rc-field-form/es/interface';
import type { FormListFieldData } from 'antd/es/form/FormList';
import { FormItemProps } from 'antd/es/form';

const { Item, List, ErrorList } = Form;

export interface FieldProps extends Omit<FormItemProps, 'children'>, Attributes {
  component: FC
  name: NamePath
  fields: FieldProps[]
  isArray?: boolean
  element: ReactElementLike
}

const result = ({
  isArray,
  component,
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

  return isArray ? (
    <List initialValue={field.initialValue} name={field.name} rules={field.rules as ValidatorRule[]}>
      {(fields, _, { errors }) => (
        <>
          {map((antField: FormListFieldData) => (
            <Item {...field} name={antField.name} fieldKey={antField.fieldKey} key={antField.key}>
              {createElement(component, field)}
            </Item>
          ))(fields)}
          <ErrorList errors={errors} />
        </>
      )}
    </List>
  ) : (
    <Item {...field}>
      {createElement(component, field)}
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
