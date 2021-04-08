import { keys, eq } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export enum NormalStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

const textMap = {
  [NormalStatus.Active]: 'active',
  [NormalStatus.Inactive]: 'inactive',
};

export const normalStatuses = keys(textMap);
export const getNormalStatusOptions = getOptions(textMap);
export const getNormalStatusText = getText(textMap);
export const formatNormalStatus = eq(NormalStatus.Active);
export const parseNormalStatus = (value: boolean | undefined | null) => (value
  ? NormalStatus.Active
  : NormalStatus.Inactive);
