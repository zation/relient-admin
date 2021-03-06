import React, { useCallback, useContext, useState } from 'react';
import { array, func, string, bool } from 'prop-types';
import { ConfigContext } from 'antd/lib/config-provider';
import { Input, Button } from 'antd';

const result = ({
  width = 188,
  placeholder,
  clearFilters,
  onConfirm,
  onReset,
}) => {
  const { locale, getPrefixCls } = useContext(ConfigContext);

  const [inputValue, setInputValue] = useState('');

  const onInputChange = useCallback(({ target: { value } }) => setInputValue(value), []);

  const onFinalConfirm = useCallback(() => {
    onConfirm(inputValue);
  }, [inputValue, onConfirm]);

  const onFinalReset = useCallback(() => {
    clearFilters();
    setInputValue('');
    onReset();
  }, [onReset, clearFilters]);

  const prefixCls = getPrefixCls('table-filter');

  return (
    <div>
      <div style={{ padding: 8, width }}>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          onPressEnter={onFinalConfirm}
        />
      </div>
      <div className={`${prefixCls}-dropdown-btns`}>
        <Button type="link" onClick={onFinalReset} size="small" disabled={inputValue === ''}>
          {locale.Table.filterReset}
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={onFinalConfirm}
        >
          {locale.Table.filterConfirm}
        </Button>
      </div>
    </div>
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
  placeholder: string,
  onConfirm: func.isRequired,
  onReset: func.isRequired,
  width: string,
};

export default result;
