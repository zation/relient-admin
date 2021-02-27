import React, { ReactNode } from 'react';
import { object, string, arrayOf, shape, bool, node } from 'prop-types';
import { Form, Radio } from 'antd';
import { map } from 'lodash/fp';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import defaultFieldLayout from '../../constants/default-field-layout';
import useFieldInfo from '../../hooks/use-field-info';

const { Item } = Form;
const { Group } = Radio;

export interface RadioGroupOption {
  value?: string
  text?: string
}

export interface RadioGroupProps {
  input: FieldInputProps<string | undefined>
  meta: FieldMetaState<string | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  options: RadioGroupOption[]
}

const result = ({
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  extra,
  options,
  required,
  disabled,
}: RadioGroupProps) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={label}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
      extra={extra}
    >
      <Group onChange={onChange} value={value} disabled={disabled}>
        {map((option: RadioGroupOption) => (
          <Radio key={option.value} value={option.value}>{option.text}</Radio>
        ))(options)}
      </Group>
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  extra: node,
  options: arrayOf(shape({
    value: string,
    text: string,
  })),
  required: bool,
  disabled: bool,
};

result.displayName = __filename;

export default result;
