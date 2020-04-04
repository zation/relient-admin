import React from 'react';
import { object, string, arrayOf, shape, bool } from 'prop-types';
import { Form, Checkbox } from 'antd';
import { map } from 'lodash/fp';
import { getFieldInfo } from '../../utils';

const { Item } = Form;
const { Group } = Checkbox;

const result = ({
  input: { onChange, value },
  meta: { touched, error },
  layout: { wrapperCol, labelCol } = {},
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
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
    >
      <Group onChange={onChange} value={value || []} disabled={disabled}>
        {map((option) => (
          <Checkbox key={option.value} value={option.value}>{option.text}</Checkbox>
        ))(options)}
      </Group>
    </Item>
  );
};

result.propTypes = {
  input: object.isRequired,
  meta: object.isRequired,
  layout: object,
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
