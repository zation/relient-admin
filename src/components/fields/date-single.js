import React from 'react';
import { string, object, bool, func } from 'prop-types';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import useFieldInfo from '../../hooks/use-field-info';

const { Item } = Form;

const result = ({
  input,
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  placeholder,
  required,
  disabled,
  disabledDate,
  tips,
  format = 'YYYY-MM-DD',
}) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, tips });

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
      <DatePicker
        format={format}
        value={input.value ? moment(input.value, format) : undefined}
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
