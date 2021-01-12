/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { join } from 'lodash/fp';
import TableFilter from '../components/table-filter';

export default ({ changeFilterValue, dataKey, options, multiple }) => {
  const [filterDropdownVisible, onFilterDropdownVisibleChange] = useState(false);

  return useMemo(() => ({
    filters: options,
    filterDropdownVisible,
    onFilterDropdownVisibleChange,
    filterDropdown: ({
      prefixCls,
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      filters,
      visible,
    }) => (
      <TableFilter
        multiple={multiple}
        prefixCls={prefixCls}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        clearFilters={clearFilters}
        filters={filters}
        visible={visible}
        confirm={confirm}
        onConfirm={() => {
          changeFilterValue(join(',')(selectedKeys), dataKey);
          onFilterDropdownVisibleChange(false);
        }}
        onReset={() => changeFilterValue(undefined, dataKey)}
      />
    ),
  }), [filterDropdownVisible, changeFilterValue, dataKey, multiple]);
};
