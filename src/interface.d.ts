import type { ReactNode, Key } from 'react';
import type { FormInstance } from 'antd/es/form';
import type { FormPopProps } from './components/form/pop';
import type { DetailsProps } from './components/details';

export interface Style {
  [key: string]: string | number | null | undefined
}

export interface Option {
  dataKey?: string | number
  value?: string | number | null
  label?: string
}

export interface OnFilter<Model> {
  (item: Model, dataKey: string, value: Key[] | Key | undefined | null): boolean
}

export interface Filter<Model> {
  dataKey: string
  label?: string
  options: Option[]
  mode?: 'multiple' | 'tags'
  defaultValue: Key[] | Key | undefined | null
  dropdownMatchSelectWidth?: boolean
  onFilterChange?: (value: string) => void
  onFilter?: OnFilter<Model>
  disabled?: boolean
}

export interface FilterValue {
  dataKey: string
  value: Key[] | Key | undefined | null
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
  showSuccessMessage?: boolean
}

export interface Editor<Item> extends Omit<FormPopProps, 'onSubmit'> {
  onOpen?: () => void
  shouldReload?: boolean
  getInitialValues?: (item: Item | null | undefined) => any
  onSubmit: (valuesWithId: any, form: FormInstance, item: Item | null | undefined) => Promise<any>
  showSuccessMessage?: boolean
}

export interface Details<Item> extends DetailsProps {
  getDataSource?: (detailsItems: Item) => any
  onOpen?: (detailsItems: Item) => void
  onClose?: () => void
}
