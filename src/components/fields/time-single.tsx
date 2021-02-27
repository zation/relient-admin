import React, { ReactNode } from 'react';
import { string, object, bool, func, node } from 'prop-types';
import { Form, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import type { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;

export interface TimeSingleProps extends Pick<PickerTimeProps<Moment>, 'hourStep' | 'minuteStep' | 'secondStep' | 'defaultOpenValue' | 'format' | 'disabledDate'> {
  input: FieldInputProps<string | undefined>
  meta: FieldMetaState<string | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  disabled?: boolean
  extra?: ReactNode
  placeholder?: string
  dateFormat?: string
  showTime?: boolean
}

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
  dateFormat = 'HH:mm:ss',
}: TimeSingleProps) => {
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
        value={input.value ? moment(input.value, dateFormat) : undefined}
        onChange={(_, value) => input.onChange(value)}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        format={dateFormat}
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
