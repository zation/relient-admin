import { useCallback } from 'react';
import { Message } from 'antd';
import { ACTIVE, INACTIVE } from '../constants/normal-status';

export default ({ update }) => useCallback(async ({
  id,
  status,
}) => {
  await update({
    id,
    status: status === ACTIVE ? INACTIVE : ACTIVE,
  });
  Message.success('修改成功');
}, [update]);
