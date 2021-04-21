import { PUSH } from 'relient/actions/history';
import { startsWith } from 'lodash/fp';
import { getWithBaseUrl } from 'relient/url';
import type { Middleware } from 'redux';
import { getFeatureBy } from 'relient/features';

export default <State>(baseUrl: string): Middleware<{}, State> => () => (next) => (action) => {
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
