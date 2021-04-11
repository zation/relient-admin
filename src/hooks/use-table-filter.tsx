/* eslint-disable react/prop-types */
import React, { Key, useMemo, useState } from 'react';
import type { ColumnFilterItem, ColumnType, FilterDropdownProps } from 'antd/es/table/interface';
import TableFilter from '../components/table-filter';

export interface UseTableFilterParams extends Pick<ColumnType<any>, 'filterIcon'> {
  changeFilterValue: (values: Key[], dataKey: string) => void
  dataKey: string
  options: ColumnFilterItem[]
  multiple?: boolean
}

export default function useTableFilter({
  changeFilterValue,
  dataKey,
  options,
  multiple,
  filterIcon,
}: UseTableFilterParams) {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<Key[]>();

  return useMemo(() => ({
    filters: options,
    filterDropdownVisible,
    onFilterDropdownVisibleChange,
    filteredValue,
    filterIcon,
    filterDropdown: ({
      prefixCls,
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      filters,
      visible,
    }: FilterDropdownProps) => (
      <TableFilter
        multiple={multiple}
        prefixCls={prefixCls}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        clearFilters={clearFilters}
        filters={filters}
        visible={visible}
        confirm={confirm}
        onConfirm={() => {
          changeFilterValue(selectedKeys, dataKey);
          setFilteredValue(selectedKeys);
          onFilterDropdownVisibleChange(false);
        }}
        onReset={() => {
          setFilteredValue(undefined);
          changeFilterValue([], dataKey);
        }}
      />
    ),
  }), [filterDropdownVisible, changeFilterValue, dataKey, multiple, filterIcon]);
}
