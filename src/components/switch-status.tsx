import React, { useCallback } from 'react';
import {
  message,
  Switch,
} from 'antd';
import {
  number,
  oneOf,
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
}

function RelientSwitchStatus({ id, status, update }: SwitchStatusProps) {
  const toggleNormalStatus = useCallback(async () => {
    await update({
      id,
      status: status === NormalStatus.Active ? NormalStatus.Inactive : NormalStatus.Active,
    });
    message.success('编辑成功');
  }, [status, id]);

  return <Switch checked={status === NormalStatus.Active} onChange={toggleNormalStatus} />;
}

RelientSwitchStatus.propTypes = {
  id: number.isRequired,
  status: oneOf(normalStatuses).isRequired,
};

export default RelientSwitchStatus;
