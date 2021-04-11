/* eslint-disable react/prop-types */
import React, { Key, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
import TableSearch from '../components/table-search';

const defaultFilterIcon = <SearchOutlined />;

export interface UseTableSearchParams extends Pick<ColumnType<any>, 'filterIcon'> {
  changeFilterValue: (values: Key[], dataKey: string) => void
  dataKey: string
  placeholder?: string
  width?: number
}

export default function useTableSearch({
  changeFilterValue,
  dataKey,
  filterIcon = defaultFilterIcon,
  placeholder,
  width,
}: UseTableSearchParams) {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);
  const [filteredValue, setFilteredValue] = useState<Key[]>();

  return useMemo(
    () => ({
      filterDropdownVisible,
      onFilterDropdownVisibleChange,
      filteredValue, // used for icon highlight
      filterIcon,
      filterDropdown: ({
        prefixCls,
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        visible,
      }: FilterDropdownProps) => (
        <TableSearch
          prefixCls={prefixCls}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          clearFilters={clearFilters}
          visible={visible}
          confirm={confirm}
          placeholder={placeholder}
          width={width}
          onConfirm={(value) => {
            changeFilterValue(value ? [value] : [], dataKey);
            setFilteredValue(value ? [value] : undefined);
            onFilterDropdownVisibleChange(false);
          }}
          onReset={() => {
            changeFilterValue([], dataKey);
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
