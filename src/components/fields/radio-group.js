import React from 'react';
import { object, string, arrayOf, shape, bool } from 'prop-types';
import { Form, Radio } from 'antd';
import { map } from 'lodash/fp';
import { getFieldInfo } from '../../utils';

const { Item } = Form;
const { Group } = Radio;

const result = ({
  input: { onChange, value },
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
  label,
  tips,
  options,
  required,
  disabled,
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
      <Group onChange={onChange} value={value} disabled={disabled}>
        {map((option) => (
          <Radio key={option.value} value={option.value}>{option.text}</Radio>
        ))(options)}
      </Group>
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
  label: string,
  tips: string,
  options: arrayOf(shape({
    value: string,
    text: string,
  })),
  required: bool,
  disabled: bool,
};

result.displayName = __filename;

export default result;
