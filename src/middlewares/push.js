import { PUSH } from 'relient/actions/history';
import { startsWith } from 'lodash/fp';
import { getFeatureBy } from '../features';

export default () => (next) => (action) => {
  const {
    payload,
    type,
  } = action;

  if (type === PUSH && !startsWith('.')(payload) && !startsWith('/')(payload)) {
    return next({
      ...action,
      payload: getFeatureBy('link')(payload),
    });
  }

  return next(action);
};
