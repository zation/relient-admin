/* eslint-disable react/jsx-props-no-spreading */
import React, {
  createElement,
  Key,
  MouseEventHandler,
  ReactNode,
} from 'react';
import {
  func,
  object,
  bool,
} from 'prop-types';
import {
  Input,
  Button,
  Select,
  DatePicker,
  SelectProps,
  ButtonProps,
} from 'antd';
import {
  map,
  flow,
  join,
  prop,
} from 'lodash/fp';
import { useI18N } from 'relient/i18n';
import type { SearchProps } from 'antd/lib/input';
import type { Moment } from 'moment';
import type { DetailsProps } from './details';
import FormPop, { FormPopProps } from './form/pop';
import Details from './details';
import type { QueryField } from '../interface';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export interface FilterItem extends SelectProps {
  dataKey: string
  label?: string
}

export interface DatePickerItem {
  label?: string
  dataKey: string
  disabledDate?: (date: Moment) => boolean
}

export interface CreateButton {
  text: string
  element?: ReactNode
  onClick: MouseEventHandler<HTMLElement>
  size?: ButtonProps['size']
  type?: ButtonProps['type']
}

export interface TableHeaderProps<Model, CreatorValues, CreatorSubmitReturn, EditorValues, EditorSubmitReturn> {
  query?: {
    onFieldChange: SelectProps['onSelect'],
    onValueChange: SearchProps['onChange']
    field?: string
    value?: string
    width?: number
    fields?: QueryField[]
    placeholder?: string
    fussy?: boolean
    onSearch?: SearchProps['onSearch']
  }
  createButton?: CreateButton
  filter: {
    items: FilterItem[]
    onSelect: (selectedValue: Key[] | Key | null | undefined, dataKey: string) => void
  }
  reset?: () => void
  datePicker?: {
    items: DatePickerItem[]
    onSelect: (selectedValue: [string, string], dataKey: string) => void
  }
  details?: DetailsProps<Model>
  creator?: FormPopProps<CreatorValues, CreatorSubmitReturn>
  editor?: FormPopProps<EditorValues, EditorSubmitReturn>
  openCreator?: () => void
  openEditor?: (dataSource?: any) => void
}

function TableHeader<Model, CreatorValues, CreatorSubmitReturn, EditorValues, EditorSubmitReturn>({
  query,
  createButton,
  filter,
  reset,
  datePicker,
  details,
  creator,
  openCreator,
  editor,
}: TableHeaderProps<Model, CreatorValues, CreatorSubmitReturn, EditorValues, EditorSubmitReturn>) {
  const i18n = useI18N();

  return (
    <div className="relient-admin-table-header-root">
      {details && createElement((Details<Model>), details)}

      {creator && createElement((FormPop<CreatorValues, CreatorSubmitReturn>), creator)}

      {editor && createElement((FormPop<EditorValues, EditorSubmitReturn>), editor)}

      <div>
        {createButton && (createButton.element ? createButton.element : (
          <Button
            type={createButton.type || 'primary'}
            size={createButton.size || 'large'}
            onClick={createButton.onClick || openCreator}
          >
            {createButton.text}
          </Button>
        ))}
      </div>

      <div className="relient-admin-table-header-operations">
        {filter && map<FilterItem, ReactNode>(({
          label,
          dataKey,
          ...others
        }) => (
          <div key={dataKey}>
            <span className="relient-admin-table-header-operation-label">{label}</span>
            <Select
              onSelect={(selectedValue: FilterItem['value']) => filter.onSelect(selectedValue, dataKey)}
              {...others}
            />
          </div>
        ))(filter.items)}

        {datePicker && map(({ label, dataKey, disabledDate }) => (
          <div key={dataKey}>
            <span className="relient-admin-table-header-operation-label">{label}</span>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={(
                _,
                selectedValue,
              ) => datePicker.onSelect(selectedValue, dataKey)}
              disabledDate={disabledDate}
            />
          </div>
        ))(datePicker.items)}

        {query && (query.fussy || query.fields) && (
          <div>
            {!query.fussy && (
              <Select
                onSelect={query.onFieldChange}
                value={query.field}
                className="relient-admin-table-header-operation-label"
                dropdownMatchSelectWidth={false}
              >
                {map(({ dataKey, label }: QueryField) => (
                  <Option
                    value={dataKey || ''}
                    key={dataKey}
                  >
                    {label}
                  </Option>
                ))(query.fields)}
              </Select>
            )}
            <Search
              style={{ width: query.width || 362 }}
              placeholder={query.placeholder || (query.fussy
                ? i18n('searchBy', { keywords: flow(map(prop('label')), join('、'))(query.fields) })
                : i18n('search'))?.toString()}
              onChange={query.onValueChange}
              value={query.value}
              onSearch={query.onSearch}
            />
          </div>
        )}

        {reset && (
          <Button onClick={reset}>{i18n('reset')}</Button>
        )}
      </div>
    </div>
  );
}

TableHeader.propTypes = {
  query: object,
  createButton: object,
  filter: object,
  details: object,
  detailsVisible: bool,
  closeDetails: func,
  creator: object,
  editor: object,
  openCreator: func,
  openEditor: func,
  closeCreator: func,
  closeEditor: func,
  creatorVisible: bool,
  editorVisible: bool,
  onCreateSubmit: func,
  onEditSubmit: func,
  datePicker: object,
  reset: func,
};

TableHeader.displayName = __filename;

export default TableHeader;
