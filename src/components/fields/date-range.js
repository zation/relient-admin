import React from 'react';
import { string, object, bool, func } from 'prop-types';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import { getFieldInfo } from '../../utils';

const { RangePicker } = DatePicker;

const { Item } = Form;

const result = ({
  input,
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  placeholder = [],
  required,
  disabled,
  tips,
  disabledDate,
  format = 'YYYY-MM-DD',
}) => {
  const { validateStatus, help } = getFieldInfo({ touched, error, tips });

  return (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={label}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
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
  tips: string,
  format: string,
  disabledDate: func,
};

result.displayName = __filename;

export default result;
