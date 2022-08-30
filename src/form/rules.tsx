/* eslint-disable @typescript-eslint/no-throw-literal */
import {
  flow,
  isFinite,
  isNil,
  nth,
  size,
  split,
} from 'lodash/fp';
import type {
  NamePath,
  Rule,
  RuleRender,
} from 'rc-field-form/es/interface';
import type { I18N } from '../interface';

export interface SameAsRule {
  (targetNamePath: NamePath, targetLabel: string): RuleRender
}

export const createSameAsRule = (i18n: I18N) => (messageKey: string): SameAsRule => (
  targetNamePath,
  targetLabel,
) => ({ getFieldValue }) => ({
  async validator(rule: Rule, value: any) {
    if (value && getFieldValue(targetNamePath) !== value) {
      throw i18n(messageKey, { targetLabel, value });
    }
  },
});

export const createPositiveNumberRule = (i18n: I18N) => (messageKey: string) => ({
  async validator(rule: Rule, value: any) {
    if (value !== '' && Number(value) <= 0) {
      throw i18n(messageKey, { value });
    }
  },
});

export const createPriceRule = (i18n: I18N) => (messageKey: string) => ({
  async validator(rule: Rule, value: any) {
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
