import { values, eq } from 'lodash/fp';
import getText from '../utils/get-text';
import getOptions from '../utils/get-options';

export enum NormalStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

const textMap = {
  [NormalStatus.Active]: '已激活',
  [NormalStatus.Inactive]: '已禁用',
};

export const normalStatuses = values(NormalStatus);
export const getNormalStatusOptions = getOptions(textMap);
export const getNormalStatusText = getText(textMap);
export const formatNormalStatus = eq(NormalStatus.Active);
export const parseNormalStatus = (value: boolean | undefined | null) => (value
  ? NormalStatus.Active
  : NormalStatus.Inactive);
