import BigNumber from 'bignumber.js';

export const formatPercentage = (number) => new BigNumber(number).multipliedBy(100).toNumber();
export const parsePercentage = (number) => new BigNumber(number).dividedBy(100).toNumber();
