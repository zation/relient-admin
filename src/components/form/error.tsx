import React from 'react';
import { array, string } from 'prop-types';
import { map } from 'lodash/fp';
import { Alert } from 'antd';

export interface ErrorProps {
  errors?: string[]
  error?: string
}

const result = ({ errors, error }: ErrorProps) => {
  if (error) {
    return (
      <Alert
        style={{ marginBottom: 20 }}
        message={error}
        type="warning"
      />
    );
  }
  if (errors && errors.length > 0) {
    return (
      <Alert
        style={{ marginBottom: 20 }}
        message={errors.length > 1
          ? (
            <ul style={{ margin: 0 }}>
              {map((item: string) => <li>{item}</li>)(errors)}
            </ul>
          ) : errors[0]}
        type="warning"
      />
    );
  }
  return null;
};

result.propTypes = {
  errors: array,
  error: string,
};

result.displayName = __filename;

export default result;
