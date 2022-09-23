import React, {
  useMemo,
  useState,
} from 'react';
import type {
  ColumnFilterItem,
  ColumnType,
  FilterDropdownProps,
} from 'antd/es/table/interface';
import TableFilter from '../components/table-filter';
import {
  FilterValue,
} from '../interface';

export interface UseTableFilterParams {
  value: FilterValue['value'],
  onChange: (value: FilterValue['value']) => void | Promise<void>
  options: ColumnFilterItem[]
  multiple?: boolean
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableFilter({
  value,
  onChange,
  options,
  multiple = true,
  filterIcon,
  showButtons = true,
}: UseTableFilterParams) {
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);

  return useMemo<Pick<ColumnType<any>,
  'filters' |
  'filterDropdownOpen' |
  'onFilterDropdownOpenChange' |
  'filteredValue' |
  'filterIcon' |
  'filterDropdown'>>(() => ({
    filters: options,
    filterDropdownOpen,
    onFilterDropdownOpenChange,
    filteredValue: value,
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
            onChange(newSelectedKeys);
          }
        }}
        onConfirm={() => {
          onChange(selectedKeys);
          onFilterDropdownOpenChange(false);
        }}
        onReset={() => {
          if (clearFilters) {
            clearFilters();
          }
          onChange([]);
          onFilterDropdownOpenChange(false);
        }}
      />
    ),
  }), [
    onChange,
    options,
    multiple,
    filterIcon,
    showButtons,
    filterDropdownOpen,
    onFilterDropdownOpenChange,
    value,
  ]);
}
