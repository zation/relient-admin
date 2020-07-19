import React from 'react';
import { string, object, bool, func, node } from 'prop-types';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { RangePicker } = DatePicker;

const { Item } = Form;

const result = ({
  input,
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  placeholder = [],
  required,
  disabled,
  extra,
  disabledDate,
  format = 'YYYY-MM-DD',
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
      <RangePicker
        format={format}
        value={input.value
          ? [moment(input.value[0], format), moment(input.value[1], format)]
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
  placeholder: string,
  required: bool,
  disabled: bool,
  extra: node,
  format: string,
  disabledDate: func,
};

result.displayName = __filename;

export default result;
