import type { ReactNode } from 'react';
import type { FormInstance } from 'antd/es/form';
import type { FormPopProps } from './components/form/pop';
import type { DetailsProps } from './components/details';

export interface Style {
  [key: string]: string | number | null | undefined
}

export interface Option {
  text?: string | null
  value?: string | number | null
}

export interface Filter {
  dataKey: string
  label?: string
  options: Option[]
  defaultValue?: string
  dropdownMatchSelectWidth?: boolean
  onFilterChange?: (value: string) => void
  disabled?: boolean
}

export interface FilterValue {
  dataKey: string
  value: string
}

export interface DateValue {
  dataKey: string
  value: [string, string]
}

export type ID = string | number;

export interface PaginationData {
  current: number
  size: number
  total: number
  ids: ID[]
}

export interface ShowTotal {
  (total: number, range: [number, number]): ReactNode
}

export interface Creator extends FormPopProps {
  onOpen?: () => void
}

export interface Editor<Item> extends Omit<FormPopProps, 'onSubmit'> {
  onOpen?: () => void
  shouldReload?: boolean
  getInitialValues?: (item: Item | null | undefined) => any
  onSubmit: (valuesWithId: any, form: FormInstance, item: Item | null | undefined) => Promise<any>
}

export interface Details<Item> extends DetailsProps {
  getDataSource?: (detailsItems: Item) => any
  onOpen?: (detailsItems: Item) => void
  onClose?: () => void
}
