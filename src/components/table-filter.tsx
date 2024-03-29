import React, {
  useCallback,
  useContext,
  Key,
} from 'react';
import {
  array,
  func,
  bool,
} from 'prop-types';
import {
  Menu,
  Button,
  Checkbox,
  Radio,
  MenuProps,
} from 'antd';
import {
  map,
  toString,
} from 'lodash/fp';
import type { ColumnFilterItem } from 'antd/es/table/interface';
import { Context } from '../context';

function getFilterItems(
  filters: ColumnFilterItem[],
  prefixCls: string,
  filteredKeys: Key[],
  multiple: boolean,
): MenuProps['items'] {
  return filters.map((filter, index) => {
    const key = String(filter.value);

    if (filter.children) {
      return {
        key: key || index,
        label: filter.text,
        popupClassName: `${prefixCls}-dropdown-submenu`,
        children: getFilterItems(filter.children, prefixCls, filteredKeys, multiple),
      };
    }

    const Component = multiple ? Checkbox : Radio;

    return {
      key: filter.value !== undefined ? key : index,
      label: (
        <>
          <Component checked={filteredKeys.includes(key)} />
          <span>{filter.text}</span>
        </>
      ),
    };
  });
}

export interface TableFilterProps {
  // from antd
  filters?: ColumnFilterItem[]
  selectedKeys: Key[]
  setSelectedKeys: (selectedKeys: string[]) => void

  // from usage
  onReset?: () => void
  onConfirm?: () => void
  onSelect?: (selectedKeys: string[]) => void
  multiple?: boolean
  showButtons?: boolean
}

function RelientTableFilter({
  filters,
  selectedKeys,
  setSelectedKeys,
  onReset,
  onConfirm,
  onSelect,
  multiple = true,
  showButtons = true,
}: TableFilterProps) {
  const { locale, getPrefixCls } = useContext(Context);
  const select = useCallback<NonNullable<MenuProps['onSelect']>>(({ selectedKeys: newSelectedKeys }) => {
    setSelectedKeys(newSelectedKeys);
    if (onSelect) {
      onSelect(newSelectedKeys);
    }
  }, [setSelectedKeys, onSelect]);
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
        selectedKeys={map(toString)(selectedKeys)}
        items={getFilterItems(filters || [], prefixCls, selectedKeys, multiple)}
      />
      {showButtons && (
        <div className={`${prefixCls}-dropdown-btns`}>
          <Button type="link" size="small" disabled={selectedKeys.length === 0} onClick={onReset}>
            {locale.reset}
          </Button>
          <Button type="primary" size="small" onClick={onConfirm}>
            {locale.confirm}
          </Button>
        </div>
      )}
    </>
  );
}

RelientTableFilter.propTypes = {
  // from antd
  filters: array.isRequired,
  setSelectedKeys: func.isRequired,
  selectedKeys: array.isRequired,

  // from usage
  onReset: func,
  onConfirm: func,
  onSelect: func,
  multiple: bool,
  showButtons: bool,
};

export default RelientTableFilter;
