import React from 'react';
import { array } from 'prop-types';
import { map } from 'lodash/fp';
import { Alert } from 'antd';

const result = ({ errors }) => (errors ? (
  <Alert
    style={{ marginBottom: 20 }}
    message={errors.length > 1
      ? (
        <ul style={{ margin: 0 }}>
          {map((error) => <li>{error}</li>)(errors)}
        </ul>
      ) : errors[0]}
    type="warning"
  />
) : null);

result.propTypes = {
  errors: array,
};

result.displayName = __filename;

export default result;
