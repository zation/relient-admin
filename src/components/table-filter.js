import React, { useCallback, useContext } from 'react';
import { array, string, func, bool } from 'prop-types';
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
  filters,
  selectedKeys,
  setSelectedKeys,
  clearFilters,
  onReset,
  onConfirm,
  multiple = true,
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
        multiple={multiple}
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
          multiple,
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
  // from antd
  prefixCls: string.isRequired,
  setSelectedKeys: func,
  selectedKeys: array,
  confirm: func.isRequired,
  clearFilters: func,
  filters: array,
  visible: bool.isRequired,

  // from usage
  onReset: func.isRequired,
  onConfirm: func.isRequired,
  multiple: bool,
};

result.displayName = __filename;

export default result;
