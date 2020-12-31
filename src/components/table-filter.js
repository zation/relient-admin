import React, { useCallback, useContext } from 'react';
import { array, bool, func } from 'prop-types';
import { ConfigContext } from 'antd/lib/config-provider';
import { Menu, Button, Checkbox, Radio } from 'antd';
import { flow, prop } from 'lodash/fp';

const { SubMenu, Item: MenuItem } = Menu;

function renderFilterItems(
  filters,
  prefixCls,
  filteredKeys,
  multiple,
) {
  return filters.map((filter, index) => {
    const key = String(filter.value);

    if (filter.children) {
      return (
        <SubMenu
          key={key || index}
          title={filter.text}
          popupClassName={`${prefixCls}-dropdown-submenu`}
        >
          {renderFilterItems(filter.children, prefixCls, filteredKeys, multiple)}
        </SubMenu>
      );
    }

    const Component = multiple ? Checkbox : Radio;

    return (
      <MenuItem key={filter.value !== undefined ? key : index}>
        <Component checked={filteredKeys.includes(key)} />
        <span>{filter.text}</span>
      </MenuItem>
    );
  });
}

const result = ({
  filterMultiple = true,
  filters,
  selectedKeys,
  setSelectedKeys,
  clearFilters,
  onConfirm,
  onReset,
}) => {
  const { locale, getPrefixCls } = useContext(ConfigContext);
  const select = useCallback(flow(prop('selectedKeys'), setSelectedKeys), [setSelectedKeys]);
  const onFinalConfirm = useCallback(() => {
    onConfirm({ selectedKeys });
  }, [selectedKeys, onConfirm]);
  const onFinalReset = useCallback(() => {
    clearFilters();
    onReset();
  }, [setSelectedKeys, onReset]);
  const dropdownPrefixCls = getPrefixCls('dropdown');
  const prefixCls = getPrefixCls('table-filter');

  return (
    <>
      <Menu
        multiple={filterMultiple}
        prefixCls={`${dropdownPrefixCls}-menu`}
        className={`${dropdownPrefixCls}-menu-without-submenu`}
        onSelect={select}
        onDeselect={select}
        selectedKeys={selectedKeys}
      >
        {renderFilterItems(
          filters || [],
          prefixCls,
          selectedKeys,
          filterMultiple,
        )}
      </Menu>
      <div className={`${prefixCls}-dropdown-btns`}>
        <Button type="link" size="small" disabled={selectedKeys.length === 0} onClick={onFinalReset}>
          {locale.Table.filterReset}
        </Button>
        <Button type="primary" size="small" onClick={onFinalConfirm}>
          {locale.Table.filterConfirm}
        </Button>
      </div>
    </>
  );
};

result.propTypes = {
  filterMultiple: bool,
  filters: array,
  selectedKeys: array,
  setSelectedKeys: func,
  onReset: func,
  onConfirm: func,
  clearFilters: func,
  confirm: func,
};

result.displayName = __filename;

export default result;
