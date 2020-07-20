import BigNumber from 'bignumber.js';
import { isFinite } from 'lodash/fp';

export const formatPercentage = (number) => {
  if (isFinite(Number(number))) {
    return new BigNumber(number).multipliedBy(100).toNumber();
  }
  return number;
};
export const parsePercentage = (number) => {
  if (isFinite(Number(number))) {
    new BigNumber(number).dividedBy(100).toNumber();
  }
  return number;
};
