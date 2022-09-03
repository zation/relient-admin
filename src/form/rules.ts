/* eslint-disable @typescript-eslint/no-throw-literal */
import {
  flow,
  isFinite,
  isNil,
  nth,
  size,
  split,
  identity,
} from 'lodash/fp';
import type {
  NamePath,
} from 'rc-field-form/es/interface';
import {
  FormRule,
} from 'antd';
import type { I18N } from '../interface';

export const createSameAsRule = (i18n: I18N = identity) => (messageKey: string) => (
  targetNamePath: NamePath,
  targetLabel?: string,
): FormRule => (form) => ({
  async validator(_: any, value: any) {
    if (value && form.getFieldValue(targetNamePath) !== value) {
      throw i18n(messageKey, { targetLabel, value });
    }
  },
});

export const createPositiveNumberRule = (i18n: I18N = identity) => (messageKey: string) => ({
  async validator(_: any, value: any) {
    if (value !== '' && Number(value) <= 0) {
      throw i18n(messageKey, { value });
    }
  },
});

export const createPriceRule = (i18n: I18N = identity) => (messageKey: string) => ({
  async validator(_: any, value: any) {
    if (value === '' || isNil(value)) {
      return undefined;
    }
    if (!isFinite(Number(value))) {
      throw i18n(messageKey, { value });
    }
    if (typeof value === 'string' && Number(value) > 0 && flow(split('.'), nth(1), size)(value) <= 2) {
      return undefined;
    }
    throw i18n(messageKey, { value });
  },
});
