import { flow, map, filter, propEq, concat, identity, uniqBy, prop } from 'lodash/fp';
import { ACTIVE } from '../constants/normal-status';

export default ({ textAttribute = 'name', valueAttribute = 'id' } = {}) => (selectedItem) => flow(
  filter(propEq('status', ACTIVE)),
  selectedItem ? concat(selectedItem) : identity,
  uniqBy(prop(valueAttribute)),
  map((item) => ({
    text: prop(textAttribute)(item),
    value: prop(valueAttribute)(item),
  })),
);
