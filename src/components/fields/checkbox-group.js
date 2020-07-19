import React from 'react';
import { object, string, arrayOf, shape, bool, node } from 'prop-types';
import { Form, Checkbox } from 'antd';
import { map } from 'lodash/fp';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;
const { Group } = Checkbox;

const result = ({
  label,
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  extra,
  options,
  required,
  disabled,
}) => {
  const { validateStatus, help } = useFieldInfo({ touched, error, submitError });

  return (
    <Item
      label={label}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      hasFeedback
      validateStatus={validateStatus}
      help={help}
      required={required}
      extra={extra}
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
  extra: node,
  options: arrayOf(shape({
    value: string,
    text: string,
  })),
  required: bool,
  disabled: bool,
  label: string,
};

result.displayName = __filename;

export default result;
