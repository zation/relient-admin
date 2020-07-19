import { PUSH } from 'relient/actions/history';
import { startsWith } from 'lodash/fp';
import { getWithBaseUrl } from 'relient/url';
import { getFeatureBy } from '../features';

export default (baseUrl) => () => (next) => (action) => {
  const {
    payload,
    type,
  } = action;

  if (type === PUSH && !startsWith('.')(payload) && !startsWith('/')(payload)) {
    return next({
      ...action,
      payload: getWithBaseUrl(getFeatureBy('link')(payload), baseUrl),
    });
  }

  return next(action);
};
