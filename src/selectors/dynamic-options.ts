import { flow, map, filter, propEq, concat, identity, uniqBy, prop } from 'lodash/fp';
import { NormalStatus } from '../constants/normal-status';

export default <OptionItem>({
  textAttribute = 'name',
  valueAttribute = 'id',
} = {}) => (selectedItem: OptionItem) => flow(
  filter(propEq('status', NormalStatus.Active.toString())),
  selectedItem ? concat(selectedItem) : identity,
  uniqBy(prop(valueAttribute)),
  map((item: OptionItem) => ({
    text: prop(textAttribute)(item),
    value: prop(valueAttribute)(item),
  })),
);
