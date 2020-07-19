import { useCallback } from 'react';
import { FORM_ERROR } from 'final-form';
import { map, prop, isArray, isObject } from 'lodash/fp';

export default (onSubmit, deps = []) => useCallback(async (values, form) => {
  try {
    return await onSubmit(values, form);
  } catch (e) {
    console.warn('Submission error:', e);
    if (isArray(e)) {
      return { [FORM_ERROR]: map(prop('message'))(e) };
    }
    if (isObject(e)) {
      return e;
    }
    return null;
  }
}, [onSubmit, ...deps]);
