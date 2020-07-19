import React from 'react';
import { string, object, bool, func, node } from 'prop-types';
import { Form, TimePicker } from 'antd';
import moment from 'moment';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  placeholder,
  required,
  disabled,
  disabledDate,
  hourStep,
  minuteStep,
  secondStep,
  defaultOpenValue,
  extra,
  format = 'HH:mm:ss',
}) => {
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
      <TimePicker
        defaultOpenValue={defaultOpenValue}
        value={input.value ? moment(input.value, format) : undefined}
        onChange={(_, value) => input.onChange(value)}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        format={format}
      />
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  placeholder: string,
  required: bool,
  disabled: bool,
  extra: node,
  format: string,
  disabledDate: func,
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  defaultOpenValue: string,
};

result.displayName = __filename;

export default result;
