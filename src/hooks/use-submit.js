import { useCallback } from 'react';
import { FORM_ERROR } from 'final-form';
import { map, prop } from 'lodash/fp';

export default (onSubmit) => useCallback(async () => {
  try {
    return await onSubmit();
  } catch (e) {
    console.warn('Submission error:', e);
    if (e) {
      return { [FORM_ERROR]: map(prop('message'))(e) };
    }
    return null;
  }
}, [onSubmit]);
