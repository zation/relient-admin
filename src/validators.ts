import {
  requiredValidator,
  sameAsValidator,
  minLengthValidator,
  maxLengthValidator,
  positiveNumberValidator,
  lessOrEqualThanValidator,
  moreOrEqualThanValidator,
  composeValidators,
} from 'relient/form';
import { isFinite, isNil, flow, size, split, nth } from 'lodash/fp';

export const required = requiredValidator('requiredInvalid');
export const sameAs = sameAsValidator('sameAsInvalid');
export const minLength = minLengthValidator('minLengthInvalid');
export const maxLength = maxLengthValidator('maxLengthInvalid');
export const positiveNumber = positiveNumberValidator('positiveNumberInvalid');
export const lessOrEqualThan = lessOrEqualThanValidator('lessOrEqualThanInvalid');
export const moreOrEqualThan = moreOrEqualThanValidator('moreOrEqualThanInvalid');
export const number = (value: string | null | undefined | number) => {
  if (value === '' || isNil(value) || isFinite(Number(value))) {
    return undefined;
  }
  return 'numberInvalid';
};

export const price = (value: string | null | undefined | number) => {
  if (value === '' || isNil(value)) {
    return undefined;
  }
  if (!isFinite(Number(value))) {
    return 'numberInvalid';
  }
  if (typeof value === 'string' && Number(value) > 0 && flow(split('.'), nth(1), size)(value) <= 2) {
    return undefined;
  }
  return 'priceInvalid';
};

export const requiredPrice = composeValidators(required, price);
export const phoneNumber = minLength(7);
export const password = composeValidators(required, minLength(6));
export const confirmedPassword = composeValidators(
  required,
  sameAs('password'),
  minLength(6),
);
export const confirmedNewPassword = composeValidators(
  required,
  sameAs('newPassword'),
  minLength(6),
);
