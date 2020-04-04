import { flow, prop, reduce } from 'lodash/fp';
import BigNumber from 'bignumber.js';

export const sumBy = (attribute) => flow(
  reduce((total, data) => total.plus(prop(attribute)(data)), new BigNumber(0)),
  (total) => total.toNumber(),
);

export const sumOf = (array) => (attribute) => flow(
  reduce((total, data) => total.plus(prop(attribute)(data)), new BigNumber(0)),
  (total) => total.toNumber(),
)(array);
