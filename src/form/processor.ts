import { isFinite } from 'lodash/fp';
import BigNumber from 'bignumber.js';
import { ChangeEvent } from 'react';

export const normalizePercentage = (number: any) => {
  if (number && isFinite(Number(number))) {
    return new BigNumber(number).multipliedBy(100).toNumber();
  }
  return number;
};

export const getPercentageFromEvent = ({
  target: { value },
}: ChangeEvent<HTMLInputElement>) => {
  if (value && isFinite(Number(value))) {
    return new BigNumber(value).dividedBy(100).toNumber();
  }
  return value;
};
