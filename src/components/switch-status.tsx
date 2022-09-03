import React, { useCallback } from 'react';
import {
  message,
  Switch,
} from 'antd';
import {
  oneOf,
  func,
  string,
} from 'prop-types';
import {
  NormalStatus,
  normalStatuses,
} from '../constants/normal-status';

export interface SwitchStatusProps<ID> {
  id: ID
  status?: NormalStatus
  update: (params: { id: ID, status?: NormalStatus }) => any
  successMessage?: string
}

function RelientSwitchStatus<ID>({
  id,
  status,
  update,
  successMessage = '编辑成功',
}: SwitchStatusProps<ID>) {
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
  // id: any.isRequired, // NOTICE: conflict with ts check
  status: oneOf(normalStatuses).isRequired,
  update: func.isRequired,
  successMessage: string,
};

export default RelientSwitchStatus;
