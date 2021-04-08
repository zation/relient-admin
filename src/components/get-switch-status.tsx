import React, { useCallback } from 'react';
import { message, Switch } from 'antd';
import { number, oneOf } from 'prop-types';
import type { ActionCreator } from 'redux';
import { useI18N } from 'relient/i18n';
import useAction from '../hooks/use-action';
import { NormalStatus, normalStatuses } from '../constants/normal-status';

export interface SwitchStatusProps {
  id: number | string
  status?: NormalStatus
}

export default function getSwitchStatus <T>(updateAction: ActionCreator<T>) {
  const result = ({ id, status }: SwitchStatusProps) => {
    const update = useAction(updateAction);
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

  return result;
}
