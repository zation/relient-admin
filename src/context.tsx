import React, {
  createContext,
  ReactElement,
  useMemo,
} from 'react';
import { ConfigConsumerProps } from 'antd/lib/config-provider';

export interface ContextValue {
  uploadUrl: string
  cdnDomain: string
  locale: {
    confirm: string
    reset: string
    submit: string
    cancel: string
  }
  getPrefixCls: ConfigConsumerProps['getPrefixCls']
}

const defaultLocale = { confirm: '确定', reset: '重置', submit: '提交', cancel: '取消' };
const defaultGetPrefixCls = () => '';

export const Context = createContext<ContextValue>({
  uploadUrl: '',
  cdnDomain: '',
  locale: defaultLocale,
  getPrefixCls: defaultGetPrefixCls,
});

export function Provider({
  uploadUrl = '',
  cdnDomain = '',
  locale = defaultLocale,
  getPrefixCls = defaultGetPrefixCls,
  children,
}: Partial<ContextValue> & {
  children: ReactElement
}) {
  const value = useMemo(() => ({
    uploadUrl,
    cdnDomain,
    locale,
    getPrefixCls,
  }), [uploadUrl, cdnDomain, locale, getPrefixCls]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
