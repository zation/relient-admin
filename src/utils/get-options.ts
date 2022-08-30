import { identity } from 'lodash/fp';
import type { I18N } from '../interface';

export default (textMap: {
  [key: string]: string
}) => (i18n: I18N = identity) => Object.keys(textMap).map((key) => ({
  value: key,
  label: i18n(textMap[key]),
}));
