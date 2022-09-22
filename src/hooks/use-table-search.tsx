import React, { Key, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
import TableSearch from '../components/table-search';
import { ChangeCustomQueryValue } from '../interface';

const defaultFilterIcon = <SearchOutlined />;

export interface UseTableSearchParams {
  changeFilterValue?: (values: Key[], dataKey: string) => void
  changeCustomQueryValue?: ChangeCustomQueryValue
  dataKey: string
  placeholder?: string
  width?: number
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableSearch({
  changeFilterValue,
  changeCustomQueryValue,
  dataKey,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
  showButtons,
}: UseTableSearchParams) {
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<Key[]>();

  return useMemo(
    () => ({
      filterDropdownOpen,
      onFilterDropdownOpenChange,
      filteredValue, // used for icon highlight
      filterIcon,
      // TODO: change inputValue in TableSearch according to filterValue
      filterDropdown: ({
        clearFilters,
      }: FilterDropdownProps) => (
        <TableSearch
          showButtons={showButtons}
          placeholder={placeholder}
          width={width}
          onConfirm={(value) => {
            if (changeFilterValue) {
              changeFilterValue(value ? [value] : [], dataKey);
            }
            if (changeCustomQueryValue) {
              changeCustomQueryValue(value, dataKey);
            }
            setFilteredValue(value ? [value] : undefined);
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
              changeCustomQueryValue(undefined, dataKey);
            }
            setFilteredValue(undefined);
            onFilterDropdownOpenChange(false);
          }}
        />
      ),
    }),
    [
      filterDropdownOpen,
      changeFilterValue,
      dataKey,
      filterIcon,
      placeholder,
      width,
    ],
  );
}
