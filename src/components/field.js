import React, { isValidElement } from 'react';
import { string, object, node, func } from 'prop-types';
import { identity } from 'lodash/fp';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import Input from './fields/input';

const result = ({
  element,
  name,
  htmlType = 'text',
  onValueChange,
  parse = identity,
  format = identity,
  ...rest
}) => {
  if (isValidElement(element)) {
    return element;
  }

  return (
    <>
      <Field
        name={name}
        htmlType={htmlType}
        component={Input}
        parse={parse}
        format={format}
        {...rest}
      />
      {onValueChange && (
        <OnChange name={name}>{onValueChange}</OnChange>
      )}
    </>
  );
};

result.propTypes = {
  name: string,
  element: node,
  form: object,
  htmlType: string,
  onValueChange: func,
  parse: func,
  format: func,
};

result.displayName = __filename;

export default result;
