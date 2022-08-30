import { identity } from 'lodash/fp';
import type { I18N } from '../interface';

export default (textMap: {
  [key: string]: any
}) => (i18n: I18N = identity) => (key: string) => {
  if (key) {
    const text = textMap[key];
    if (text) {
      return i18n(text);
    }
    console.warn(`Can not find proper key: ${key} in textMap: ${JSON.stringify(textMap)}`);
  }

  return '';
};
