import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
import TableSearch from '../components/table-search';
import { ChangeCustomSearchValue, CustomSearchValue } from '../interface';

const defaultFilterIcon = <SearchOutlined />;

export interface UseTableSearchParams {
  customSearchValue?: CustomSearchValue
  changeCustomSearchValue?: ChangeCustomSearchValue
  dataKey: string
  placeholder?: string
  width?: number
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableSearch({
  customSearchValue,
  changeCustomSearchValue,
  dataKey,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
  showButtons,
}: UseTableSearchParams) {
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const propValue = customSearchValue && customSearchValue[dataKey];
  useEffect(() => {
    setInputValue(propValue || '');
  }, [propValue]);

  return useMemo<Pick<ColumnType<any>,
  'filterDropdownOpen' |
  'onFilterDropdownOpenChange' |
  'filteredValue' |
  'filterIcon' |
  'filterDropdown'>>(
    () => ({
      filterDropdownOpen,
      onFilterDropdownOpenChange,
      filteredValue: inputValue ? [inputValue] : null, // NOTICE: for filterIcon display logic
      filterIcon,
      filterDropdown: ({
        clearFilters,
      }: FilterDropdownProps) => (
        <TableSearch
          showButtons={showButtons}
          placeholder={placeholder}
          width={width}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onConfirm={(value) => {
            if (changeCustomSearchValue) {
              changeCustomSearchValue(value || '', dataKey);
            }
            onFilterDropdownOpenChange(false);
          }}
          onReset={() => {
            if (clearFilters) {
              clearFilters();
            }
            if (changeCustomSearchValue) {
              changeCustomSearchValue('', dataKey);
            }
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
      inputValue,
      setInputValue,
    ],
  );
}
