import React, { useCallback } from 'react';
import {
  message,
  Switch,
} from 'antd';
import {
  number,
  oneOf,
  func,
  string,
} from 'prop-types';
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
  successMessage?: string
}

function RelientSwitchStatus({
  id,
  status,
  update,
  successMessage = '编辑成功',
}: SwitchStatusProps) {
  const toggleNormalStatus = useCallback(async () => {
    await update({
      id,
      status: status === NormalStatus.Active ? NormalStatus.Inactive : NormalStatus.Active,
    });
    message.success(successMessage);
  }, [status, id]);

  return <Switch checked={status === NormalStatus.Active} onChange={toggleNormalStatus} />;
}

RelientSwitchStatus.propTypes = {
  id: number.isRequired,
  status: oneOf(normalStatuses).isRequired,
  update: func.isRequired,
  successMessage: string,
};

export default RelientSwitchStatus;
