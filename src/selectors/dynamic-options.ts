import { flow, map, filter, propEq, concat, identity, uniqBy, prop } from 'lodash/fp';
import { ACTIVE } from '../constants/normal-status';

export default <OptionItem>({ textAttribute = 'name', valueAttribute = 'id' } = {}) => (selectedItem: OptionItem) => flow(
  filter(propEq('status', ACTIVE)),
  selectedItem ? concat(selectedItem) : identity,
  uniqBy(prop(valueAttribute)),
  map((item: OptionItem) => ({
    text: prop(textAttribute)(item),
    value: prop(valueAttribute)(item),
  })),
);
