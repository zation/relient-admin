import { keys, eq } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const ACTIVE = 'ACTIVE';
export const INACTIVE = 'INACTIVE';

const textMap = {
  [ACTIVE]: 'active',
  [INACTIVE]: 'inactive',
};

export const normalStatuses = keys(textMap);
export const getNormalStatusOptions = getOptions(textMap);
export const getNormalStatusText = getText(textMap);
export const formatNormalStatus = eq(ACTIVE);
export const parseNormalStatus = (value) => (value ? ACTIVE : INACTIVE);
