import React from 'react';
import { object, string, arrayOf, shape, bool, node } from 'prop-types';
import { Form, Radio } from 'antd';
import { map } from 'lodash/fp';
import useFieldInfo from '../../hooks/use-field-info';
import defaultFieldLayout from '../../constants/default-field-layout';

const { Item } = Form;
const { Group } = Radio;

const result = ({
  input: { onChange, value },
  meta: { touched, error, submitError },
  layout: { wrapperCol, labelCol } = defaultFieldLayout,
  label,
  extra,
  options,
  required,
  disabled,
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
  extra: node,
  options: arrayOf(shape({
    value: string,
    text: string,
  })),
  required: bool,
  disabled: bool,
};

result.displayName = __filename;

export default result;
