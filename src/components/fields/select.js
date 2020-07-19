/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { object, string, bool, array, func, node } from 'prop-types';
import { Form, Select } from 'antd';
import { map } from 'lodash/fp';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;
const { Option, OptGroup } = Select;

const getOption = ({ text, value, disabled, className }) => (
  <Option value={value} key={value} className={className} disabled={disabled}>{text}</Option>
);

getOption.propTypes = {
  text: string.isRequired,
  value: string.isRequired,
  disabled: bool,
  className: string,
};

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  tips,
  required,
  disabled,
  showSearch,
  options,
  mode,
  optionFilterProp,
  onSelect,
  filterOption,
  size,
  extra,
  defaultActiveFirstOption,
}) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, tips, submitError });

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
  tips: string,
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
