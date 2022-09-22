import React, {
  useEffect,
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
  ChangeCustomFilterValue,
  CustomFilterValue,
} from '../interface';

export interface UseTableFilterParams {
  customFilterValue?: CustomFilterValue,
  changeCustomFilterValue?: ChangeCustomFilterValue
  dataKey: string
  options: ColumnFilterItem[]
  multiple?: boolean
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableFilter({
  customFilterValue,
  changeCustomFilterValue,
  dataKey,
  options,
  multiple = true,
  filterIcon,
  showButtons = true,
}: UseTableFilterParams) {
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<ColumnType<any>['filteredValue']>([]);

  const propValue = customFilterValue && customFilterValue[dataKey];
  useEffect(() => {
    setFilteredValue(propValue || []);
  }, [propValue]);

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
            if (changeCustomFilterValue) {
              changeCustomFilterValue(newSelectedKeys, dataKey);
            }
            setFilteredValue(newSelectedKeys);
          }
        }}
        onConfirm={() => {
          if (changeCustomFilterValue) {
            changeCustomFilterValue(selectedKeys, dataKey);
          }
          setFilteredValue(selectedKeys);
          onFilterDropdownOpenChange(false);
        }}
        onReset={() => {
          if (clearFilters) {
            clearFilters();
          }
          if (changeCustomFilterValue) {
            changeCustomFilterValue([], dataKey);
          }
          setFilteredValue([]);
          onFilterDropdownOpenChange(false);
        }}
      />
    ),
  }), [
    changeCustomFilterValue,
    dataKey,
    options,
    multiple,
    filterIcon,
    showButtons,
    filterDropdownOpen,
    onFilterDropdownOpenChange,
    filteredValue,
    setFilteredValue,
  ]);
}
