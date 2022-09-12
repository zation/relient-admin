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
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<Key[]>();

  return useMemo(() => ({
    filters: options,
    filterDropdownOpen,
    onFilterDropdownOpenChange,
    filteredValue,
    filterIcon,
    // TODO: change selectedKeys according to filterValue
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      clearFilters,
      filters,
    }: FilterDropdownProps) => (
      <TableFilter
        showButtons={showButtons}
        multiple={multiple}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        filters={filters}
        onSelect={(newSelectedKeys) => {
          if (!showButtons) {
            changeFilterValue(newSelectedKeys, dataKey);
            setFilteredValue(newSelectedKeys);
          }
        }}
        onConfirm={() => {
          changeFilterValue(selectedKeys, dataKey);
          setFilteredValue(selectedKeys);
          onFilterDropdownOpenChange(false);
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
  }), [filterDropdownOpen, changeFilterValue, dataKey, multiple, filterIcon]);
}
