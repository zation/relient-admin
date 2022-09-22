import React, {
  useMemo,
  useState,
} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
import TableSearch from '../components/table-search';
import { ChangeCustomSearchValue } from '../interface';

const defaultFilterIcon = <SearchOutlined />;

export interface UseTableSearchParams {
  changeCustomSearchValue?: ChangeCustomSearchValue
  dataKey: string
  placeholder?: string
  width?: number
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableSearch({
  changeCustomSearchValue,
  dataKey,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
  showButtons,
}: UseTableSearchParams) {
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<ColumnType<any>['filteredValue']>([]);

  return useMemo<Pick<ColumnType<any>,
  'filterDropdownOpen' |
  'onFilterDropdownOpenChange' |
  'filteredValue' |
  'filterIcon' |
  'filterDropdown'>>(
    () => ({
      filterDropdownOpen,
      onFilterDropdownOpenChange,
      filteredValue,
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
            if (changeCustomSearchValue) {
              changeCustomSearchValue(value || '', dataKey);
            }
            setFilteredValue(value ? [value] : []);
            onFilterDropdownOpenChange(false);
          }}
          onReset={() => {
            if (clearFilters) {
              clearFilters();
            }
            if (changeCustomSearchValue) {
              changeCustomSearchValue('', dataKey);
            }
            setFilteredValue([]);
            onFilterDropdownOpenChange(false);
          }}
        />
      ),
    }),
    [
      changeCustomSearchValue,
      dataKey,
      filterIcon,
      placeholder,
      width,
      showButtons,
      filterDropdownOpen,
      onFilterDropdownOpenChange,
      filteredValue,
      setFilteredValue,
    ],
  );
}
