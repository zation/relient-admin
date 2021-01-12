/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import TableSearch from '../components/table-search';

export default ({ changeFilterValue, dataKey, options, icon, placeholder, width }) => {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filtered, setFiltered] = useState(false);

  return useMemo(() => ({
    filters: options,
    filterDropdownVisible,
    onFilterDropdownVisibleChange,
    filterIcon: <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    filterDropdown: ({
      prefixCls,
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      filters,
      visible,
    }) => (
      <TableSearch
        prefixCls={prefixCls}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        clearFilters={clearFilters}
        filters={filters}
        visible={visible}
        confirm={confirm}
        icon={icon}
        placeholder={placeholder}
        width={width}
        onConfirm={(value) => {
          changeFilterValue(value, dataKey);
          if (value) {
            setFiltered(true);
          }
          onFilterDropdownVisibleChange(false);
        }}
        onReset={() => {
          setFiltered(false);
          changeFilterValue(undefined, dataKey);
        }}
      />
    ),
  }), [filterDropdownVisible, changeFilterValue, dataKey, icon, placeholder, width]);
};
