/* eslint-disable react/prop-types */
import React, { Key, useMemo, useState } from 'react';
import type { ColumnFilterItem, ColumnType, FilterDropdownProps } from 'antd/es/table/interface';
import TableFilter from '../components/table-filter';

export interface UseTableFilterParams {
  changeFilterValue: (values: Key[], dataKey: string) => void
  dataKey: string
  options: ColumnFilterItem[]
  multiple?: boolean
  showButtons?: boolean
  filterIcon: ColumnType<never>['filterIcon'],
}

export default function useTableFilter({
  changeFilterValue,
  dataKey,
  options,
  multiple,
  filterIcon,
  showButtons,
}: UseTableFilterParams) {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<Key[]>();

  return useMemo(() => ({
    filters: options,
    filterDropdownVisible,
    onFilterDropdownVisibleChange,
    filteredValue,
    filterIcon,
    // TODO: change selectedKeys according to filterValue
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
        showButtons={showButtons}
        multiple={multiple}
        prefixCls={prefixCls}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        clearFilters={clearFilters}
        filters={filters}
        visible={visible}
        confirm={confirm}
        onSelect={(newSelectedKeys) => {
          if (!showButtons) {
            changeFilterValue(newSelectedKeys, dataKey);
            setFilteredValue(newSelectedKeys);
          }
        }}
        onConfirm={() => {
          changeFilterValue(selectedKeys, dataKey);
          setFilteredValue(selectedKeys);
          onFilterDropdownVisibleChange(false);
        }}
        onReset={() => {
          if (clearFilters) {
            clearFilters();
          }
          setFilteredValue(undefined);
          changeFilterValue([], dataKey);
        }}
      />
    ),
  }), [filterDropdownVisible, changeFilterValue, dataKey, multiple, filterIcon]);
}
