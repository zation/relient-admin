/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import TableSearch from '../components/table-search';

const defaultFilterIcon = <SearchOutlined />;

export default ({
  changeFilterValue,
  dataKey,
  options,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
}) => {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState(false);

  return useMemo(
    () => ({
      filters: options,
      filterDropdownVisible,
      onFilterDropdownVisibleChange,
      filteredValue, // used for icon highlight
      filterIcon,
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
          placeholder={placeholder}
          width={width}
          onConfirm={(value) => {
            changeFilterValue(value, dataKey);
            setFilteredValue(value ? [value] : undefined);
            onFilterDropdownVisibleChange(false);
          }}
          onReset={() => {
            setFilteredValue(undefined);
            changeFilterValue(undefined, dataKey);
          }}
        />
      ),
    }),
    [filterDropdownVisible, changeFilterValue, dataKey, filterIcon, placeholder, width],
  );
};
