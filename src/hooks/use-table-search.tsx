import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
import TableSearch from '../components/table-search';

const defaultFilterIcon = <SearchOutlined />;

export interface UseTableSearchParams {
  value: string
  onChange: (value: string) => void | Promise<void>
  placeholder?: string
  width?: number
  showButtons?: boolean
  filterIcon?: ColumnType<any>['filterIcon'],
}

export default function useTableSearch({
  value,
  onChange,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
  showButtons,
}: UseTableSearchParams) {
  const [filterDropdownOpen, onFilterDropdownOpenChange] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return useMemo<Pick<ColumnType<any>,
  'filterDropdownOpen' |
  'onFilterDropdownOpenChange' |
  'filteredValue' |
  'filterIcon' |
  'filterDropdown'>>(
    () => ({
      filterDropdownOpen,
      onFilterDropdownOpenChange,
      filteredValue: value ? [value] : null, // NOTICE: for filterIcon display logic
      filterIcon,
      filterDropdown: ({
        clearFilters,
      }: FilterDropdownProps) => (
        <TableSearch
          showButtons={showButtons}
          placeholder={placeholder}
          width={width}
          value={inputValue}
          onChange={setInputValue}
          onConfirm={() => {
            onChange(inputValue);
            onFilterDropdownOpenChange(false);
          }}
          onReset={() => {
            if (clearFilters) {
              clearFilters();
            }
            onChange('');
            setInputValue('');
            onFilterDropdownOpenChange(false);
          }}
        />
      ),
    }),
    [
      filterIcon,
      placeholder,
      width,
      showButtons,
      filterDropdownOpen,
      onFilterDropdownOpenChange,
      inputValue,
      setInputValue,
      onChange,
      value,
    ],
  );
}
