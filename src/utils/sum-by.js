import { flow, prop, reduce, isString } from 'lodash/fp';
import BigNumber from 'bignumber.js';

export default (handler) => flow(
  reduce((total, data) => total.plus(
    isString(handler) ? prop(handler)(data) : handler(data),
  ), new BigNumber(0)),
  (total) => total.toNumber(),
);
