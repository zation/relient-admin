/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode } from 'react';
import { object, string, bool, array, func, node } from 'prop-types';
import { Form, Select } from 'antd';
import { map } from 'lodash/fp';
import type { SelectProps as AntdSelectProps } from 'antd/es/select';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import defaultFieldLayout from '../../constants/default-field-layout';
import useFieldInfo from '../../hooks/use-field-info';

const { Item } = Form;
const { Option, OptGroup } = Select;

interface GetOptionProps {
  text?: string
  value: string
  disabled?: boolean
  className?: string
}

const getOption = ({ text, value, disabled, className }: GetOptionProps) => (
  <Option value={value} key={value} className={className} disabled={disabled}>{text}</Option>
);

getOption.propTypes = {
  text: string,
  value: string.isRequired,
  disabled: bool,
  className: string,
};

export interface SelectOption {
  value?: string
  text?: string
}

export interface SelectProps extends Pick<AntdSelectProps<string>, 'showSearch' | 'mode' | 'optionFilterProp' | 'onSelect' | 'filterOption' | 'size' | 'defaultActiveFirstOption'> {
  input: FieldInputProps<string>
  meta: FieldMetaState<string>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  options: SelectOption[]
}

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  extra,
  required,
  disabled,
  showSearch,
  options,
  mode,
  optionFilterProp,
  onSelect,
  filterOption,
  size,
  defaultActiveFirstOption,
}: SelectProps) => {
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
      <Select
        optionFilterProp={optionFilterProp}
        filterOption={filterOption}
        onSelect={onSelect}
        showSearch={showSearch}
        disabled={disabled}
        {...input}
        value={mode === 'multiple' || mode === 'tags' ? (input.value || []) : input.value}
        mode={mode}
        size={size}
        defaultActiveFirstOption={defaultActiveFirstOption}
      >
        {map(({ children, group, text, value, disabled: optionDisabled, className }) => {
          if (group) {
            return (
              <OptGroup label={group} key={group}>
                {map(getOption)(children)}
              </OptGroup>
            );
          }
          return getOption({ text, value, className, disabled: optionDisabled });
        })(options)}
      </Select>
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  required: bool,
  disabled: bool,
  showSearch: bool,
  options: array,
  mode: string,
  size: string,
  optionFilterProp: string,
  onSelect: func,
  filterOption: func,
  extra: node,
  defaultActiveFirstOption: bool,
};

result.displayName = __filename;

export default result;
