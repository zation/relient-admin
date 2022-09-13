import format from 'date-fns/fp/format';
import parseISO from 'date-fns/fp/parseISO';
import isValid from 'date-fns/fp/isValid';
import {
  isFinite,
  trim,
  isNaN,
} from 'lodash/fp';

const datetime = ({
  formatter = 'yyyy-MM-dd HH:mm:ss',
  defaultDisplay = '--',
  parse = parseISO,
} = {}) => (value: number | Date | string): string => {
  try {
    const dateValue = typeof value === 'string' ? parse(value) : value;
    if (isValid(dateValue)) {
      return format(formatter)(dateValue);
    }
    return defaultDisplay;
  } catch (e) {
    console.warn(e);
    return defaultDisplay;
  }
};

export const date = ({
  formatter = 'yyyy-MM-dd',
  defaultDisplay = '--',
  parse = parseISO,
} = {}) => datetime({ formatter, defaultDisplay, parse });

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
