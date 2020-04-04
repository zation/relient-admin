import { actionTypeCreator, createAction } from 'relient/actions';

const actionType = actionTypeCreator(__filename);

export const SET_FEATURE = actionType('SET_FEATURE');
export const setFeature = createAction(SET_FEATURE);
