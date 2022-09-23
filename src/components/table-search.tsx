import React, {
  ChangeEventHandler,
  useCallback,
  useContext,
} from 'react';
import { func, string, bool } from 'prop-types';
import { Input, Button } from 'antd';
import { Context } from '../context';

export interface TableSearchProps {
  width?: number
  placeholder?: string
  onConfirm: () => void
  onReset: () => void
  showButtons?: boolean
  value: string
  onChange: (inputValue: string) => void
}

function RelientTableSearch({
  width = 188,
  placeholder,
  onConfirm,
  onReset,
  value,
  onChange,
  showButtons = true,
}: TableSearchProps) {
  const { locale, getPrefixCls } = useContext(Context);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(({ target }) => {
    onChange(target.value);
    if (!showButtons) {
      onConfirm();
    }
  }, [showButtons, onConfirm, onChange]);

  const onFinalReset = useCallback(() => {
    onChange('');
    onReset();
  }, [onReset, onChange]);

  const prefixCls = getPrefixCls('table-filter');

  return (
    <div>
      <div style={{ padding: 8, width }}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onInputChange}
          onPressEnter={onConfirm}
        />
      </div>
      {showButtons && (
        <div className={`${prefixCls}-dropdown-btns`}>
          <Button type="link" onClick={onFinalReset} size="small" disabled={value === ''}>
            {locale.reset}
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={onConfirm}
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
  value: string,
  onChange: func.isRequired,
};

export default RelientTableSearch;
