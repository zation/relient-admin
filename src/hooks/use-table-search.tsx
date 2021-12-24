/* eslint-disable react/prop-types */
import React, { Key, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
import TableSearch from '../components/table-search';

const defaultFilterIcon = <SearchOutlined />;

export interface UseTableSearchParams extends Pick<ColumnType<any>, 'filterIcon'> {
  changeFilterValue?: (values: Key[], dataKey: string) => void
  changeCustomQueryValue?: (value: string | undefined | null, dataKey: string) => void
  dataKey: string
  placeholder?: string
  width?: number
  showButtons?: boolean
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
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<Key[]>();

  return useMemo(
    () => ({
      filterDropdownVisible,
      onFilterDropdownVisibleChange,
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
            onFilterDropdownVisibleChange(false);
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
    ],
  );
}
