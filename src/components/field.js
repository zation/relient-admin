/* eslint-disable react/jsx-props-no-spreading */
import React, { isValidElement } from 'react';
import { string, node, func, bool, array } from 'prop-types';
import { identity, map } from 'lodash/fp';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { FieldArray } from 'react-final-form-arrays';
import Input from './fields/input';

const result = ({
  element,
  name,
  htmlType = 'text',
  onValueChange,
  parse = identity,
  format = identity,
  isArray,
  fields,
  ...rest
}) => {
  if (isValidElement(element)) {
    return element;
  }

  return (
    <>
      {isArray ? (
        <FieldArray name={name} key={name}>
          {({ fields: arrayFields }) => arrayFields.map((arrayFieldName) => (
            fields ? (
              map((arrayField) => (
                <Field
                  key={`${arrayFieldName}.${arrayField.name}`}
                  htmlType={htmlType}
                  component={Input}
                  parse={parse}
                  format={format}
                  {...rest}
                  {...arrayField}
                  name={`${arrayFieldName}.${arrayField.name}`}
                />
              ))(fields)
            ) : (
              <Field
                htmlType={htmlType}
                component={Input}
                parse={parse}
                format={format}
                {...rest}
                name={arrayFieldName}
              />
            )
          ))}
        </FieldArray>
      ) : (
        <Field
          name={name}
          htmlType={htmlType}
          component={Input}
          parse={parse}
          format={format}
          {...rest}
        />
      )}
      {onValueChange && (
        <OnChange name={name}>{onValueChange}</OnChange>
      )}
    </>
  );
};

result.propTypes = {
  name: string,
  element: node,
  isArray: bool,
  htmlType: string,
  onValueChange: func,
  parse: func,
  format: func,
  fields: array,
};

result.displayName = __filename;

export default result;
