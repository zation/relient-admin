import React, { useCallback } from 'react';
import { Message, Switch } from 'antd';
import { number, oneOf } from 'prop-types';
import useAction from '../hooks/use-action';
import useI18N from '../hooks/use-i18n';
import { ACTIVE, INACTIVE, normalStatuses } from '../constants/normal-status';

export default (updateAction) => {
  const result = ({ id, status }) => {
    const update = useAction(updateAction);
    const i18n = useI18N();
    const toggleNormalStatus = useCallback(async () => {
      await update({
        id,
        status: status === ACTIVE ? INACTIVE : ACTIVE,
      });
      Message.success(i18n('editSuccess'));
    }, [status, id, i18n]);

    return <Switch checked={status === 'ACTIVE'} onChange={toggleNormalStatus} />;
  };

  result.propTypes = {
    id: number.isRequired,
    status: oneOf(normalStatuses).isRequired,
  };

  result.displayName = __filename;

  return result;
};
