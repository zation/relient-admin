import { includes, toUpper, flow, prop } from 'lodash/fp';

export default (ignoreCase = true) => (item, field, value) => flow(
  prop(field),
  (fieldValue) => ignoreCase ? toUpper(fieldValue) : fieldValue,
  includes(ignoreCase ? toUpper(value) : value),
)(item)
