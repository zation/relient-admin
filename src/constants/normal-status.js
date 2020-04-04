import { keys, eq } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const ACTIVE = 'ACTIVE';
export const INACTIVE = 'INACTIVE';

const textMap = {
  [ACTIVE]: '已激活',
  [INACTIVE]: '未激活',
};

export const normalStatuses = keys(textMap);
export const normalStatusOptions = getOptions(textMap)();
export const getNormalStatusText = getText(textMap)();
export const formatNormalStatus = eq(ACTIVE);
export const parseNormalStatus = (value) => (value ? ACTIVE : INACTIVE);
