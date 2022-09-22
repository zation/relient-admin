import React, {
  ChangeEventHandler,
  useCallback,
  useContext,
  useState,
} from 'react';
import { func, string, bool } from 'prop-types';
import { Input, Button } from 'antd';
import { Context } from '../context';

export interface TableSearchProps {
  width?: number
  placeholder?: string
  onConfirm: (value?: string) => void
  onReset: () => void
  showButtons?: boolean
}

function RelientTableSearch({
  width = 188,
  placeholder,
  onConfirm,
  onReset,
  showButtons = true,
}: TableSearchProps) {
  const { locale, getPrefixCls } = useContext(Context);

  const [inputValue, setInputValue] = useState('');

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(({ target: { value } }) => {
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
            {locale.reset}
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={onFinalConfirm}
          >
            {locale.confirm}
          </Button>
        </div>
      )}
    </div>
  );
}

RelientTableSearch.propTypes = {
  placeholder: string,
  onConfirm: func.isRequired,
  onReset: func.isRequired,
  width: string,
  showButtons: bool,
};

export default RelientTableSearch;
