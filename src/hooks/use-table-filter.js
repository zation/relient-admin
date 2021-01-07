/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import { join } from 'lodash/fp';
import TableFilter from '../components/table-filter';

export default ({ changeFilterValue, dataKey, options }) => {
  const [visible, setVisible] = useState(false);

  return useMemo(() => ({
    filters: options,
    filterDropdownVisible: visible,
    onFilterDropdownVisibleChange: setVisible,
    filterDropdown: (props) => (
      <TableFilter
        {...props}
        onConfirm={({ selectedKeys }) => {
          changeFilterValue(join(',')(selectedKeys), dataKey);
          setVisible(false);
        }}
        onReset={() => changeFilterValue(undefined, dataKey)}
      />
    ),
  }), [visible, changeFilterValue, dataKey]);
};
