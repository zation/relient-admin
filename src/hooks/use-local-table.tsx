import React, { useCallback, useEffect, useState } from 'react';
import {
  concat,
  every,
  filter,
  find,
  flow,
  includes,
  isFunction,
  isNil,
  map,
  prop,
  propEq,
  reject,
  toUpper,
  any,
} from 'lodash/fp';
import { message } from 'antd';
import { useI18N } from 'relient/i18n';
import { Moment } from 'moment';
import TableHeader, { CreateButton } from '../components/table-header';
import useBasicTable from './use-basic-table';
import { DEFAULT_SIZE } from '../constants/pagination';
import type { Creator, Details, Editor, Filter, Option, ShowTotal, PaginationData } from '../interface';
import { ID } from '../interface';

export interface CustomQuery<Model> {
  value: string
  field: string
  onFilter: (item: Model, field: string, value: string) => boolean
}

export interface UseLocalTableParams<Model> {
  query?: {
    onFieldChange?: (fieldKey: string) => void
    onValueChange?: (value?: string) => void
    fields?: Option[]
    width?: number
    placeholder?: string
    fussy?: boolean
  }
  showReset?: boolean
  filters?: Filter[]
  createButton?: CreateButton
  datePickers?: {
    dataKey: string,
    label: string,
    onDateChange: (value: [string, string]) => void
    disabledDate: (date: Moment) => boolean
  }[]
  pagination?: {
    size?: number
    showTotal?: ShowTotal
  }
  paginationInitialData: PaginationData
  creator?: Creator
  editor?: Editor<Model>
  details?: Details<Model>
}

export default function useLocalTable<Model = any>({
  query,
  showReset,
  filters = [],
  createButton,
  datePickers,
  pagination,
  paginationInitialData,
  creator,
  editor,
  details,
}: UseLocalTableParams<Model>) {
  const { onFieldChange, onValueChange, fields, width, fussy } = query || {};
  const {
    current: initialCurrent = 1,
    size: initialSize = DEFAULT_SIZE,
  } = paginationInitialData || {};
  const {
    onSubmit: creatorSubmit,
    onClose: creatorOnClose,
    onOpen: creatorOnOpen,
  } = creator || {};
  const {
    onSubmit: editorSubmit,
    onClose: editorOnClose,
    onOpen: editorOnOpen,
    getInitialValues: getEditorInitialValues,
  } = editor || {};
  const {
    getDataSource: getDetailsDataSource,
    onOpen: detailsOnOpen,
    onClose: detailsOnClose,
  } = details || {};

  const {
    dateValues,
    setDateValues,
    queryField,
    setQueryField,
    queryValue,
    setQueryValue,
    filterValues,
    setFilterValues,
    creatorVisible,
    editorVisible,
    editItem,
    openCreator,
    closeCreator,
    openEditor,
    closeEditor,
    openDetails,
    closeDetails,
    detailsVisible,
    detailsItem,
    reset,
  } = useBasicTable({
    fields,
    filters,
    editorOnOpen,
    editorOnClose,
    creatorOnOpen,
    creatorOnClose,
    detailsOnClose,
    detailsOnOpen,
  });
  const i18n = useI18N();
  const [currentPage, setCurrentPage] = useState(initialCurrent);
  const [pageSize, setPageSize] = useState(initialSize);
  useEffect(() => {
    if (initialSize !== pageSize) {
      setPageSize(initialSize);
    }
    if (initialCurrent !== currentPage) {
      setCurrentPage(initialCurrent);
    }
  }, [initialSize, initialCurrent]);
  const onPageChange = useCallback((newCurrentPage, newPageSize) => {
    if (newCurrentPage !== currentPage) {
      setCurrentPage(newCurrentPage);
    }
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  }, [currentPage, pageSize]);

  const [customQueries, changeCustomQueries] = useState<CustomQuery<Model>[]>([]);

  const changeCustomQuery = useCallback((value, field, onFilter) => {
    const existingQuery = find(propEq('field', field))(customQueries);
    if (!existingQuery) {
      changeCustomQueries([...customQueries, { field, value, onFilter }]);
    } else if (!value) {
      changeCustomQueries(reject(propEq('field', field))(customQueries));
    } else if (existingQuery.value !== value) {
      changeCustomQueries(
        map((customQuery: CustomQuery<Model>) => (customQuery.field === field
          ? { field, value, onFilter }
          : customQuery))(customQueries),
      );
    }
  }, [customQueries, changeCustomQueries]);

  const onQueryFieldChange = useCallback((fieldKey) => {
    if (isFunction(onFieldChange)) {
      onFieldChange(fieldKey);
    }
    if (isFunction(onValueChange)) {
      onValueChange('');
    }
    setQueryField(fieldKey);
    setQueryValue('');
  }, [
    onFieldChange,
    onValueChange,
  ]);
  const onQueryValueChange = useCallback(({ target: { value } }) => {
    if (isFunction(onValueChange)) {
      onValueChange(value);
    }
    setCurrentPage(1);
    setQueryValue(value);
  }, [
    onValueChange,
  ]);
  const onFilterValueChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onChange'))(filters);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setCurrentPage(1);
    setFilterValues(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(filterValues));
  }, [
    filters,
    filterValues,
  ]);
  const onDateChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onChange'))(datePickers);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setCurrentPage(1);
    setDateValues(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(dateValues));
  }, [
    datePickers,
    dateValues,
  ]);
  const onCreatorSubmit = useCallback(async (values, formInstance) => {
    if (creatorSubmit) {
      await creatorSubmit(values, formInstance);
    }
    closeCreator();
    message.success(i18n('createSuccess'));
  }, [
    creatorSubmit,
  ]);
  const onEditorSubmit = useCallback(async (values, formInstance) => {
    if (editorSubmit) {
      await editorSubmit({ ...values, id: (editItem as any).id as ID }, formInstance, editItem);
    }
    closeEditor();
    message.success(i18n('editSuccess'));
  }, [
    editorSubmit,
    editItem,
  ]);
  const getDataSource = useCallback(filter(
    (item: any) => {
      let queryResult = true;
      if (queryValue) {
        const match = (key: string) => flow(
          prop(key),
          toUpper,
          includes(toUpper(queryValue)),
        )(item);
        if (fussy) {
          queryResult = any(flow(prop('key'), match))(fields);
        } else if (queryField) {
          queryResult = match(queryField);
        }
      }

      let customQueryResult = true;
      if (customQueries.length > 0) {
        customQueryResult = every(({ value, onFilter, field }) => (
          onFilter
            ? onFilter(item, field, value)
            : propEq(field, value)(item)))(customQueries);
      }

      let filterResult = true;
      if (filterValues.length > 0) {
        filterResult = every(({ dataKey, value }) => {
          const onFilter = flow(find(propEq('dataKey', dataKey)), prop('onFilter'))(filters);
          return value === '' || isNil(value) || (onFilter
            ? onFilter(item, dataKey, value)
            : propEq(dataKey, value)(item)
          );
        })(filterValues);
      }

      let datesResult = true;
      if (dateValues.length > 0) {
        datesResult = every(({ dataKey, value }) => {
          if (value && value.length > 1) {
            const selectedDate = prop(dataKey)(item);
            const [startDate, endDate] = value;
            return startDate.isBefore(selectedDate) && endDate.isAfter(selectedDate);
          }
          return true;
        })(dateValues);
      }

      return filterResult && queryResult && datesResult && customQueryResult;
    },
  ), [
    queryValue,
    queryField,
    filterValues,
    dateValues,
    filters,
    customQueries,
  ]);

  return {
    changeCustomQuery,
    getDataSource,
    filterValues,
    changeFilterValue: onFilterValueChange,
    openCreator,
    openEditor,
    openDetails,
    reset,
    pagination: {
      showTotal: ((total) => `${i18n('totalPage', { total })}`) as ShowTotal,
      pageSize,
      onChange: onPageChange,
      current: currentPage,
      ...pagination,
    },
    tableHeader: <TableHeader
      query={{
        onFieldChange: onQueryFieldChange,
        onValueChange: onQueryValueChange,
        value: queryValue,
        field: queryField,
        fields,
        width,
        fussy,
      }}
      createButton={createButton}
      filter={{
        items: map(({
          dataKey,
          options,
          ...others
        }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(filterValues),
          options,
          ...others,
        }))(filters),
        onSelect: onFilterValueChange,
      }}
      editor={editor && {
        ...editor,
        initialValues: getEditorInitialValues
          ? getEditorInitialValues(editItem)
          : editItem,
        onSubmit: onEditorSubmit,
        visible: editorVisible,
        onClose: closeEditor,
      }}
      details={details && {
        ...details,
        dataSource: getDetailsDataSource
          ? getDataSource(detailsItem)
          : detailsItem,
        visible: detailsVisible,
        close: closeDetails,
      }}
      creator={creator && {
        ...creator,
        onSubmit: onCreatorSubmit,
        visible: creatorVisible,
        onClose: closeCreator,
      }}
      openEditor={openEditor}
      openCreator={openCreator}
      reset={showReset ? reset : undefined}
      datePicker={{
        items: map(({ dataKey, ...others }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(dateValues),
          ...others,
        }))(datePickers),
        onSelect: onDateChange,
      }}
    />,
  };
}
