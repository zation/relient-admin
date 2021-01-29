import { handleActions } from 'relient/reducers';
import { SET_FEATURE } from '../actions/feature';
import type { Feature } from '../features';

export default {
  feature: handleActions<Feature | null, Feature | null>({
    [SET_FEATURE]: (_, { payload }) => payload,

  }, null),
};
