import React, { useCallback } from 'react';
import {
  message,
  Switch,
} from 'antd';
import {
  number,
  oneOf,
} from 'prop-types';
import { useI18N } from 'relient/i18n';
import {
  NormalStatus,
  normalStatuses,
} from '../constants/normal-status';

interface UpdateParams {
  id: number | string
  status?: NormalStatus
}

export interface SwitchStatusProps extends UpdateParams {
  update: (params: UpdateParams) => void
}

const result = ({ id, status, update }: SwitchStatusProps) => {
  const i18n = useI18N();
  const toggleNormalStatus = useCallback(async () => {
    await update({
      id,
      status: status === NormalStatus.Active ? NormalStatus.Inactive : NormalStatus.Active,
    });
    message.success(i18n('editSuccess'));
  }, [status, id, i18n]);

  return <Switch checked={status === 'ACTIVE'} onChange={toggleNormalStatus} />;
};

result.propTypes = {
  id: number.isRequired,
  status: oneOf(normalStatuses).isRequired,
};

result.displayName = __filename;

export default result;
