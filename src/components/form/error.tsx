import React from 'react';
import {
  array,
  string,
} from 'prop-types';
import { map } from 'lodash/fp';
import { Alert } from 'antd';

export interface ErrorProps {
  errors?: string[]
  error?: string
}

function RelientError({ errors, error }: ErrorProps) {
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
    const message = errors.length > 1
      ? (
        <ul style={{ margin: 0 }}>
          {map((item: string) => <li key={item}>{item}</li>)(errors)}
        </ul>
      ) : errors[0];

    return (
      <Alert
        style={{ marginBottom: 20 }}
        message={message}
        type="warning"
      />
    );
  }
  return null;
}

RelientError.propTypes = {
  errors: array,
  error: string,
};

export default RelientError;
