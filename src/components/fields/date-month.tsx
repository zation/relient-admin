import React, { ReactNode } from 'react';
import { string, object, bool, func, node } from 'prop-types';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import type { MonthPickerProps } from 'antd/es/date-picker';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;
const { MonthPicker } = DatePicker;

export interface DateMonthProps extends Pick<MonthPickerProps, 'disabled' | 'disabledDate' | 'placeholder'>{
  input: FieldInputProps<string | undefined>
  meta: FieldMetaState<string | undefined>
  layout?: { wrapperCol: ColProps, labelCol: ColProps }
  label?: ReactNode
  required?: boolean
  extra?: ReactNode
  dateFormat?: string
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
  extra,
  dateFormat = 'YYYY-MM',
}: DateMonthProps) => {
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
      <MonthPicker
        format={dateFormat}
        value={input.value ? moment(input.value, dateFormat) : undefined}
        onChange={(_, value) => input.onChange(value)}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
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
  dateFormat: string,
  disabledDate: func,
};

result.displayName = __filename;

export default result;
