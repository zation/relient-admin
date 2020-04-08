import { useCallback } from 'react';
import { Message } from 'antd';
import useI18N from './use-i18n';
import { ACTIVE, INACTIVE } from '../constants/normal-status';

export default ({ update }) => useCallback(async ({
  id,
  status,
}) => {
  const i18n = useI18N();
  await update({
    id,
    status: status === ACTIVE ? INACTIVE : ACTIVE,
  });
  Message.success(i18n('updateSuccess'));
}, [update]);
