import type {
  ReactNode,
  Key,
} from 'react';
import type { FormInstance } from 'antd/es/form';
import { Moment } from 'moment';
import type { FormPopProps, DetailsProps, FilterItem } from './components';

export interface I18N {
  (
    messageKey: string,
    values?: {
      [key: string]: ReactNode | string | number
    },
  ): string | undefined | (ReactNode | string | number)[]
}

export interface Style {
  [key: string]: string | number | null | undefined
}

export interface QueryField {
  dataKey?: string | number
  value?: string | number | null
  label?: string
}

export interface ChangeCustomFilterValue {
  (value: FilterValue['value'], dataKey: string): void | Promise<void>
}

export interface ChangeCustomSearchValue {
  (value: string, dataKey: string): void | Promise<void>
}

export interface OnFilter<Model> {
  (item: Model, value: FilterValue['value'], dataKey: string): boolean
}

export interface Filter<Model> extends FilterItem {
  onFilterChange?: (value: string) => void
  onFilter?: OnFilter<Model>
}

export interface FilterValue {
  dataKey: string
  value: Key[] | undefined | null
}

export interface DateValue {
  dataKey: string
  value: [string, string]
}

export type RecordTypeId<RecordType> = RecordType extends { id: infer ID } ? ID : number;

export interface PaginationData<RecordType> {
  current: number
  size: number
  total: number
  ids: RecordTypeId<RecordType>[]
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

export interface Creator<Values, SubmitReturn = any>
  extends Omit<FormPopProps<Values, SubmitReturn>, 'open' | 'onClose'> {
  onOpen?: () => void
  successMessage?: boolean | string
  open?: boolean
  onClose?: () => void
}

export interface Editor<Item, Values, SubmitReturn = any>
  extends Omit<FormPopProps<Values, SubmitReturn>, 'onSubmit' | 'open' | 'onClose'> {
  onOpen?: () => void
  shouldReload?: boolean
  getInitialValues?: (item: Item | undefined) => Partial<Values>
  onSubmit: (
    values: Values,
    form: FormInstance<Values>,
    item: Item,
  ) => Promise<SubmitReturn>
  successMessage?: boolean | string
  open?: boolean
  onClose?: () => void
}

export interface Details<Item> extends DetailsProps<Item> {
  getDataSource?: (detailsItems: Item) => any
  onOpen?: (detailsItems: Item) => void
  onClose?: () => void
}
