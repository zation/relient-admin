import React from 'react';
import { string, node, object, bool, func, oneOfType } from 'prop-types';
import { Form, DatePicker } from 'antd';
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
  extra,
  dateFormat = 'YYYY-MM-DD',
  showTime,
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
      <DatePicker
        format={dateFormat}
        value={input.value ? moment(input.value, dateFormat) : undefined}
        onChange={(_, value) => input.onChange(value)}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
        showTime={showTime}
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
  showTime: oneOfType([object, bool]),
};

result.displayName = __filename;

export default result;
