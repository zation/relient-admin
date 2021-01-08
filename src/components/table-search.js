import React, { useCallback, useContext } from 'react';
import { array, func, string, node } from 'prop-types';
import { ConfigContext } from 'antd/lib/config-provider';
import { Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash/fp';

const result = ({
  icon = <SearchOutlined />,
  width = 188,
  setSelectedKeys,
  selectedKeys,
  placeholder,
  clearFilters,
  onConfirm,
  onReset,
}) => {
  const { locale } = useContext(ConfigContext);

  const onFinalConfirm = useCallback(() => {
    onConfirm(isEmpty(selectedKeys) ? { selectedKeys: undefined } : { selectedKeys });
  }, [selectedKeys, onConfirm]);

  const onFinalReset = useCallback(() => {
    clearFilters();
    onReset();
  }, [setSelectedKeys, clearFilters]);

  return (
    <div style={{ padding: 8, width: { width } }}>
      <Input
        placeholder={placeholder}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={onFinalConfirm}
        style={{ width: { width }, marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button onClick={onFinalReset} size="small" style={{ width: 90 }}>
          {locale.Table.filterReset}
        </Button>
        <Button
          icon={icon}
          type="primary"
          size="small"
          onClick={onFinalConfirm}
          style={{ width: 90 }}
        >
          {locale.Table.filterConfirm}
        </Button>
      </Space>
    </div>
  );
};

result.propTypes = {
  icon: node,
  setSelectedKeys: func,
  selectedKeys: array,
  clearFilters: func,
  placeholder: string,
  onConfirm: func,
  onReset: func,
  width: string,
};

export default result;
