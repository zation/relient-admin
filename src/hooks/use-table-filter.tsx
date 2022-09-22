import React, { Key, useMemo, useState } from 'react';
import type { ColumnFilterItem, ColumnType, FilterDropdownProps } from 'antd/es/table/interface';
import TableFilter from '../components/table-filter';
import { ChangeCustomQueryValue } from '../interface';

export interface UseTableFilterParams {
  changeFilterValue?: (values: Key[], dataKey: string) => void
  changeCustomQueryValue?: ChangeCustomQueryValue
  dataKey: string
  options: ColumnFilterItem[]
  multiple?: boolean
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableFilter({
  changeFilterValue,
  changeCustomQueryValue,
  dataKey,
  options,
  multiple = true,
  filterIcon,
  showButtons = true,
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
            if (changeFilterValue) {
              changeFilterValue(newSelectedKeys, dataKey);
            }
            if (changeCustomQueryValue) {
              changeCustomQueryValue(selectedKeys, dataKey);
            }
            setFilteredValue(newSelectedKeys);
          }
        }}
        onConfirm={() => {
          if (changeFilterValue) {
            changeFilterValue(selectedKeys, dataKey);
          }
          if (changeCustomQueryValue) {
            changeCustomQueryValue(selectedKeys, dataKey);
          }
          setFilteredValue(selectedKeys);
          onFilterDropdownOpenChange(false);
        }}
        onReset={() => {
          if (clearFilters) {
            clearFilters();
          }
          if (changeFilterValue) {
            changeFilterValue([], dataKey);
          }
          if (changeCustomQueryValue) {
            changeCustomQueryValue([], dataKey);
          }
          setFilteredValue(undefined);
          onFilterDropdownOpenChange(false);
        }}
      />
    ),
  }), [filterDropdownOpen, changeFilterValue, dataKey, multiple, filterIcon]);
}
