import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
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
  isEmpty,
  keys,
  isArray,
} from 'lodash/fp';
import { message } from 'antd';
import { useI18N } from 'relient/i18n';
import moment, { Moment } from 'moment';
import TableHeader, { CreateButton } from '../components/table-header';
import useBasicTable, { isFilterValuesSame } from './use-basic-table';
import type {
  Creator,
  Details,
  Editor,
  Filter,
  Option,
  ShowTotal,
  PaginationData,
  FilterValue,
  DateValue,
  OnFilter,
} from '../interface';
import { ID } from '../interface';

export interface CustomQuery<Model> {
  dataKey: string
  onFilter: (item: Model, field: string, value: string | undefined | null) => boolean
}

export interface CustomQueryValue {
  [dataKey: string]: undefined | string | null
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
  customQueries?: CustomQuery<Model>[]
  showReset?: boolean
  filters?: Filter<Model>[]
  createButton?: CreateButton
  datePickers?: {
    dataKey: string,
    label: string,
    onDateChange: (value: [string, string]) => void
    disabledDate: (date: Moment) => boolean
  }[]
  pagination?: {
    pageSize?: number
    showTotal?: ShowTotal
  }
  paginationInitialData: PaginationData
  creator?: Creator
  editor?: Editor<Model>
  details?: Details<Model>
}

export default function useLocalTable<Model = any>({
  query,
  customQueries,
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
    size: initialSize = 20,
  } = paginationInitialData || {};
  const {
    onSubmit: creatorSubmit,
    onClose: creatorOnClose,
    onOpen: creatorOnOpen,
    showSuccessMessage: creatorShowSuccessMessage,
  } = creator || {};
  const {
    onSubmit: editorSubmit,
    onClose: editorOnClose,
    onOpen: editorOnOpen,
    getInitialValues: getEditorInitialValues,
    showSuccessMessage: editorShowSuccessMessage,
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
  const onReset = useCallback(() => {
    reset();
    setCurrentPage(initialCurrent);
  }, []);
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

  const [customQueryValues, setCustomQueryValues] = useState<CustomQueryValue>({});

  const changeCustomQueryValue = useCallback((value, field) => {
    if (customQueryValues[field] !== value) {
      setCustomQueryValues({ ...customQueryValues, [field]: value });
    }
  }, [customQueryValues, setCustomQueryValues]);

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
  const onFilterValueChange = useCallback((values, dataKey) => {
    if (isFilterValuesSame(values, dataKey, filterValues)) {
      return;
    }
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onChange'))(filters);
    if (isFunction(onChange)) {
      onChange(values);
    }
    setCurrentPage(1);
    setFilterValues(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        values,
      }),
    )(filterValues));
  }, [
    filters,
    filterValues,
  ]);
  const onDateChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onDateChange'))(datePickers);
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
    if (creatorShowSuccessMessage !== false) {
      message.success(i18n('createSuccess'));
    }
  }, [
    creatorSubmit,
  ]);
  const onEditorSubmit = useCallback(async (values, formInstance) => {
    if (editorSubmit) {
      await editorSubmit({ ...values, id: (editItem as any).id as ID }, formInstance, editItem);
    }
    closeEditor();
    if (editorShowSuccessMessage !== false) {
      message.success(i18n('editSuccess'));
    }
  }, [
    editorSubmit,
    editItem,
  ]);
  const getDataSource = useCallback(filter(
    (item: Model) => {
      let queryResult = true;
      if (queryValue) {
        const match = (key: string) => flow(
          prop(key),
          toUpper,
          includes(toUpper(queryValue)),
        )(item);
        if (fussy) {
          queryResult = any(flow(prop('dataKey'), match))(fields);
        } else if (queryField) {
          queryResult = match(queryField);
        }
      }

      let customQueryResult = true;
      if (!isEmpty(customQueryValues) && customQueries && customQueries.length > 0) {
        customQueryResult = flow(
          keys,
          every((dataKey: string) => {
            const value = customQueryValues[dataKey];
            const customQuery = find(propEq('dataKey', dataKey))(customQueries);
            if (!customQuery) {
              console.warn(`CustomQuery is not config for ${dataKey}`);
              return true;
            }
            const { onFilter } = customQuery;
            if (onFilter) {
              return onFilter(item, dataKey, value);
            }
            if (value) {
              return propEq(dataKey, value)(item);
            }
            return true;
          }),
        )(customQueryValues);
      }

      let filterResult = true;
      if (filterValues.length > 0) {
        filterResult = every(({ dataKey, value }: FilterValue) => {
          const onFilter: OnFilter<Model> = flow(find(propEq('dataKey', dataKey)), prop('onFilter'))(filters);
          if (isArray(value)) {
            return onFilter
              ? onFilter(item, dataKey, value)
              : includes(prop(dataKey)(item))(value);
          }
          return isNil(value) || (onFilter
            ? onFilter(item, dataKey, value)
            : propEq(dataKey, value)(item));
        })(filterValues);
      }

      let datesResult = true;
      if (dateValues.length > 0) {
        datesResult = every(({ dataKey, value }: DateValue) => {
          if (value && value.length > 1) {
            const selectedDate = prop(dataKey)(item);
            const [startDate, endDate] = value;
            return moment(new Date(startDate)).isBefore(selectedDate)
              && moment(new Date(endDate)).isAfter(selectedDate);
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
    changeCustomQueryValue,
    getDataSource,
    filterValues,
    changeFilterValue: onFilterValueChange,
    openCreator,
    openEditor,
    openDetails,
    reset: onReset,
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
      reset={showReset ? onReset : undefined}
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
