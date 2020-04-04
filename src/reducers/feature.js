import { handleActions } from 'relient/reducers';
import { SET_FEATURE } from '../actions/feature';

export default {
  feature: handleActions({
    [SET_FEATURE]: (_, { payload }) => payload,

  }, null),
};
