import dayjs, { Dayjs } from 'dayjs';
import {
  isFinite,
  trim,
  isNaN,
} from 'lodash/fp';

const datetime = ({
  formatter = 'YYYY-MM-DD HH:mm:ss',
  defaultDisplay = '--',
} = {}) => (value: number | Date | string | Dayjs): string => {
  try {
    const dayjsValue = dayjs(value);
    if (dayjsValue.isValid()) {
      return dayjsValue.format(formatter);
    }
    return defaultDisplay;
  } catch (e) {
    console.warn(e);
    return defaultDisplay;
  }
};

export const date = ({
  formatter = 'YYYY-MM-DD',
  defaultDisplay = '--',
} = {}) => datetime({ formatter, defaultDisplay });

export const time = datetime;

export const price = ({ currency = '￥', digit = 2, defaultDisplay = '--' } = {}) => (value: number): string => {
  if (isFinite(value)) {
    const number = (Math.round(value * 100) / 100).toFixed(digit);
    return trim(`${currency} ${number}`);
  }
  return defaultDisplay;
};

export const percentage = ({ digit = 2, symbol = '%', defaultDisplay = '--' } = {}) => (value: number): string => {
  if (isFinite(value)) {
    const digits = 10 ** digit;
    const result = Math.round(Number(value) * digits * 100) / digits;
    return isNaN(result) ? defaultDisplay : `${result.toFixed(digit)}${symbol}`;
  }
  return defaultDisplay;
};
