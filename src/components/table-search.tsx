import React, { useCallback, useContext, useState } from 'react';
import { func, string, bool } from 'prop-types';
import { ConfigContext } from 'antd/lib/config-provider';
import { Input, Button } from 'antd';

export interface TableSearchProps {
  width?: number
  placeholder?: string
  onConfirm: (value?: string) => void
  onReset: () => void
  showButtons?: boolean
}

const result = ({
  width = 188,
  placeholder,
  onConfirm,
  onReset,
  showButtons = true,
}: TableSearchProps) => {
  const { locale, getPrefixCls } = useContext(ConfigContext);

  const [inputValue, setInputValue] = useState('');

  const onInputChange = useCallback(({ target: { value } }) => {
    setInputValue(value);
    if (!showButtons) {
      onConfirm(value);
    }
  }, [showButtons, onConfirm, setInputValue]);

  const onFinalConfirm = useCallback(() => {
    onConfirm(inputValue);
  }, [inputValue, onConfirm]);

  const onFinalReset = useCallback(() => {
    setInputValue('');
    onReset();
  }, [onReset, setInputValue]);

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
      {showButtons && (
        <div className={`${prefixCls}-dropdown-btns`}>
          <Button type="link" onClick={onFinalReset} size="small" disabled={inputValue === ''}>
            {locale?.Table?.filterReset}
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={onFinalConfirm}
          >
            {locale?.Table?.filterConfirm}
          </Button>
        </div>
      )}
    </div>
  );
};

result.propTypes = {
  placeholder: string,
  onConfirm: func.isRequired,
  onReset: func.isRequired,
  width: string,
  showButtons: bool,
};

export default result;
