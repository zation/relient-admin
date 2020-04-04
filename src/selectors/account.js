import { getEntity } from 'relient/selectors';
import { flow, prop } from 'lodash/fp';

export const getCurrentAccount = (state) => flow(
  getEntity('account'),
  prop(getEntity('auth.currentAccountId')(state)),
)(state);

export const a = 1;
