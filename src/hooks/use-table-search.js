/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import TableSearch from '../components/table-search';

export default ({ changeFilterValue, dataKey, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return useMemo(() => ({
    filterDropdownVisible: visible,
    onFilterDropdownVisibleChange: setVisible,
    filterDropdown: (props) => (
      <TableSearch
        {...props}
        placeholder={placeholder}
        onConfirm={({ selectedKeys }) => {
          changeFilterValue(selectedKeys, dataKey);
          setVisible(false);
        }}
        onReset={() => changeFilterValue(undefined, dataKey)}
      />
    ),
  }), [visible, changeFilterValue, dataKey, placeholder]);
};
