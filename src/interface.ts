import type {
  ReactNode,
  Key,
} from 'react';
import type { FormInstance } from 'antd/es/form';
import { Moment } from 'moment';
import type { FormPopProps } from './components/form/pop';
import type { DetailsProps } from './components/details';
import type { FilterItem } from './components/table-header';

export interface Style {
  [key: string]: string | number | null | undefined
}

export interface QueryField {
  dataKey?: string | number
  value?: string | number | null
  label?: string
}

export interface OnFilter<Model> {
  (item: Model, dataKey: string, value: Key[] | Key | undefined | null): boolean
}

export interface Filter<Model> extends FilterItem {
  onFilterChange?: (value: string) => void
  onFilter?: OnFilter<Model>
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

export interface DatePicker {
  dataKey: string,
  label: string,
  onDateChange: (value: [string, string]) => void
  disabledDate: (date: Moment) => boolean
}

export interface ShowTotal {
  (total: number, range: [number, number]): ReactNode
}

export interface Creator<Values, SubmitReturn> extends FormPopProps<Values, SubmitReturn> {
  onOpen?: () => void
  showSuccessMessage?: boolean
}

export interface Editor<Item, Values, SubmitReturn> extends Omit<FormPopProps<Values, SubmitReturn>, 'onSubmit'> {
  onOpen?: () => void
  shouldReload?: boolean
  getInitialValues?: (item: Item | undefined) => Partial<Values>
  onSubmit: (
    values: Values,
    form: FormInstance<Values>,
    item: Item,
  ) => Promise<SubmitReturn>
  showSuccessMessage?: boolean
}

export interface Details<Item> extends DetailsProps<Item> {
  getDataSource?: (detailsItems: Item) => any
  onOpen?: (detailsItems: Item) => void
  onClose?: () => void
}
