import React, { ReactNode } from 'react';
import { string, object, bool, func, node, arrayOf } from 'prop-types';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import type { FieldInputProps, FieldMetaState } from 'react-final-form';
import type { ColProps } from 'antd/es/grid/col';
import type { RangePickerProps } from 'antd/es/date-picker';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { RangePicker } = DatePicker;

const { Item } = Form;

export interface DateRangeProps extends Pick<RangePickerProps, 'disabledDate' | 'placeholder' | 'disabled'>{
  input: FieldInputProps<[string, string] | undefined>
  meta: FieldMetaState<[string, string] | undefined>
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
  extra,
  disabledDate,
  dateFormat = 'YYYY-MM-DD',
}: DateRangeProps) => {
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
      <RangePicker
        format={dateFormat}
        value={input.value
          ? [moment(input.value[0], dateFormat), moment(input.value[1], dateFormat)]
          : undefined}
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
  placeholder: arrayOf(string),
  required: bool,
  disabled: bool,
  extra: node,
  dateFormat: string,
  disabledDate: func,
};

result.displayName = __filename;

export default result;
