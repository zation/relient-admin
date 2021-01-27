/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import TableSearch from '../components/table-search';

const defaultFilterIcon = <SearchOutlined />;

export default ({
  changeFilterValue,
  dataKey,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
  onFilter,
}) => {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState(false);

  return useMemo(
    () => ({
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
        visible,
      }) => (
        <TableSearch
          prefixCls={prefixCls}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          clearFilters={clearFilters}
          visible={visible}
          confirm={confirm}
          placeholder={placeholder}
          width={width}
          onConfirm={(value) => {
            changeFilterValue(value, dataKey, onFilter);
            setFilteredValue(value ? [value] : undefined);
            onFilterDropdownVisibleChange(false);
          }}
          onReset={() => {
            changeFilterValue(undefined, dataKey, onFilter);
            setFilteredValue(undefined);
          }}
        />
      ),
    }),
    [
      filterDropdownVisible,
      changeFilterValue,
      dataKey,
      filterIcon,
      placeholder,
      width,
      onFilter,
    ],
  );
};
