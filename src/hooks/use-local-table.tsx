import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
  Key,
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
import {
  FormInstance,
  message,
} from 'antd';
import dayjs from 'dayjs';
import RelientTableHeader, {
  CreateButton,
  ResetButton,
} from '../components/table-header';
import useBasicTable, { isFilterValuesSame } from './use-basic-table';
import type {
  Creator,
  Details,
  Editor,
  Filter,
  QueryField,
  ShowTotal,
  PaginationData,
  FilterValue,
  DateValue,
  OnFilter,
  DatePicker,
  ChangeCustomFilterValue,
  ChangeCustomSearchValue,
  CustomFilterValue,
  CustomSearchValue,
  CustomFilter,
  CustomSearch,
} from '../interface';

export interface UseLocalTableParams<RecordType,
  CreatorValues = Omit<RecordType, 'id'>,
  EditorValues = Partial<RecordType>,
  CreatorSubmitReturn = any,
  EditorSubmitReturn = any> {
  query?: {
    onFieldChange?: (fieldKey: string) => void
    onValueChange?: (value?: string) => void
    fields?: QueryField[]
    width?: number
    placeholder?: string
    fussy?: boolean
  }
  filters?: Filter<RecordType>[]
  customFilters?: CustomFilter<RecordType>[]
  customSearches?: CustomSearch<RecordType>[]
  createButton?: CreateButton
  resetButton?: Partial<ResetButton> | boolean
  datePickers?: DatePicker[]
  pagination?: {
    pageSize?: number
    showTotal?: ShowTotal
  }
  paginationInitialData?: PaginationData<RecordType>
  creator?: Creator<CreatorValues, CreatorSubmitReturn>
  editor?: Editor<RecordType, EditorValues, EditorSubmitReturn>
  details?: Details<RecordType>
}

export default function useLocalTable<RecordType,
  CreatorValues = Omit<RecordType, 'id'>,
  EditorValues = Partial<RecordType>,
  CreatorSubmitReturn = any,
  EditorSubmitReturn = any>({
  query,
  customFilters,
  customSearches,
  resetButton,
  filters = [],
  createButton,
  datePickers,
  pagination,
  paginationInitialData,
  creator,
  editor,
  details,
}: UseLocalTableParams<RecordType, CreatorValues, EditorValues, CreatorSubmitReturn, EditorSubmitReturn>) {
  const {
    onFieldChange,
    onValueChange,
    fields,
    width,
    fussy,
  } = query || {};
  const {
    current: initialCurrent = 1,
    size: initialSize = 20,
  } = paginationInitialData || {};
  const {
    onSubmit: creatorSubmit,
    onClose: creatorOnClose,
    onOpen: creatorOnOpen,
    successMessage: creatorSuccessMessage,
  } = creator || {};
  const {
    onSubmit: editorSubmit,
    onClose: editorOnClose,
    onOpen: editorOnOpen,
    getInitialValues: getEditorInitialValues,
    successMessage: editorSuccessMessage,
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
    creatorOpen,
    editorOpen,
    editItem,
    openCreator,
    closeCreator,
    openEditor,
    closeEditor,
    openDetails,
    closeDetails,
    detailsOpen,
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
  const [currentPage, setCurrentPage] = useState(initialCurrent);
  const [pageSize, setPageSize] = useState(initialSize);
  const [customFilterValue, setCustomFilterValue] = useState<CustomFilterValue>({});
  const [customSearchValue, setCustomSearchValue] = useState<CustomSearchValue>({});

  useEffect(() => {
    if (initialSize !== pageSize) {
      setPageSize(initialSize);
    }
    if (initialCurrent !== currentPage) {
      setCurrentPage(initialCurrent);
    }
  }, [initialSize, initialCurrent]);

  const onReset = useCallback(() => {
    reset();
    setCurrentPage(initialCurrent);
    setCustomFilterValue({});
    setCustomSearchValue({});
  }, [setCustomFilterValue, setCurrentPage, reset, initialCurrent]);

  const onPageChange = useCallback((newCurrentPage: number, newPageSize: number) => {
    if (newCurrentPage !== currentPage) {
      setCurrentPage(newCurrentPage);
    }
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  }, [currentPage, pageSize]);

  const changeCustomFilterValue: ChangeCustomFilterValue = useCallback((value, dataKey) => {
    if (customFilterValue[dataKey] !== value) {
      setCustomFilterValue({ ...customFilterValue, [dataKey]: value });
    }
  }, [customFilterValue, setCustomFilterValue]);

  const changeCustomSearchValue: ChangeCustomSearchValue = useCallback((value, dataKey) => {
    if (customSearchValue[dataKey] !== value) {
      setCustomSearchValue({ ...customSearchValue, [dataKey]: value });
    }
  }, [customSearchValue, setCustomSearchValue]);

  const onQueryFieldChange = useCallback((fieldKey: string) => {
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

  const onQueryValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(({ target: { value } }) => {
    if (isFunction(onValueChange)) {
      onValueChange(value);
    }
    setCurrentPage(1);
    setQueryValue(value);
  }, [
    onValueChange,
  ]);

  const onFilterValueChange = useCallback((value: FilterValue['value'], dataKey: FilterValue['dataKey']) => {
    if (isFilterValuesSame(value, dataKey, filterValues)) {
      return;
    }
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onChange'))(filters);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setCurrentPage(1);
    setFilterValues(flow(
      reject(propEq('dataKey')(dataKey)),
      concat<FilterValue>({
        dataKey,
        value,
      }),
    )(filterValues));
  }, [
    filters,
    filterValues,
  ]);

  const onDateChange = useCallback((value: DateValue['value'], dataKey: DateValue['dataKey']) => {
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

  const onCreatorSubmit = useCallback(async (values: CreatorValues, formInstance: FormInstance<CreatorValues>) => {
    const submitReturn = await creatorSubmit!(values, formInstance);
    closeCreator();
    if (typeof creatorSuccessMessage === 'string') {
      message.success(creatorSuccessMessage);
    } else if (creatorSuccessMessage !== false) {
      message.success('创建成功');
    }
    return submitReturn;
  }, [
    creatorSubmit,
  ]);

  const onEditorSubmit = useCallback(async (values: EditorValues, formInstance: FormInstance<EditorValues>) => {
    const submitReturn = await editorSubmit!(values, formInstance, editItem!);
    closeEditor();
    if (typeof editorSuccessMessage === 'string') {
      message.success(editorSuccessMessage);
    } else if (editorSuccessMessage !== false) {
      message.success('编辑成功');
    }
    return submitReturn;
  }, [
    editorSubmit,
    editItem,
  ]);

  const getDataSource = useCallback(filter(
    (item: RecordType) => {
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

      let customFilterResult = true;
      if (!isEmpty(customFilterValue) && customFilters && customFilters.length > 0) {
        customFilterResult = flow(
          keys,
          every((dataKey: string) => {
            const value = customFilterValue[dataKey];
            const customFilter = find<CustomFilter<RecordType>>(propEq('dataKey', dataKey))(customFilters);
            if (!customFilter) {
              console.warn(`CustomFilter is not config for ${dataKey}`);
              return true;
            }
            const { onFilter } = customFilter;
            if (onFilter) {
              return onFilter(item, value, dataKey);
            }
            if (value) {
              return includes<Key>(prop(dataKey)(item))(value);
            }
            return true;
          }),
        )(customFilterValue);
      }

      let customSearchResult = true;
      if (!isEmpty(customSearchValue) && customSearches && customSearches.length > 0) {
        customSearchResult = flow(
          keys,
          every((dataKey: string) => {
            const value = customSearchValue[dataKey];
            const customSearch = find<CustomSearch<RecordType>>(propEq('dataKey', dataKey))(customSearches);
            if (!customSearch) {
              console.warn(`CustomSearch is not config for ${dataKey}`);
              return true;
            }
            const { onSearch } = customSearch;
            if (onSearch) {
              return onSearch(item, value, dataKey);
            }
            if (value) {
              return propEq(dataKey, value)(item);
            }
            return true;
          }),
        )(customSearchValue);
      }

      let filterResult = true;
      if (filterValues.length > 0) {
        filterResult = every(({ dataKey, value }: FilterValue) => {
          const onFilter: OnFilter<RecordType> = flow(find(propEq('dataKey', dataKey)), prop('onFilter'))(filters);
          if (isArray(value)) {
            return onFilter
              ? onFilter(item, value, dataKey)
              : includes(prop(dataKey)(item))(value);
          }
          return isNil(value) || (onFilter
            ? onFilter(item, value, dataKey)
            : propEq(dataKey, value)(item));
        })(filterValues);
      }

      let datesResult = true;
      if (dateValues.length > 0) {
        datesResult = every(({ dataKey, value }: DateValue) => {
          if (value && value.length > 1) {
            const selectedDate = prop(dataKey)(item);
            const [startDate, endDate] = value;
            return dayjs(startDate).isBefore(selectedDate)
              && dayjs(endDate).isAfter(selectedDate);
          }
          return true;
        })(dateValues);
      }

      return filterResult && queryResult && datesResult && customFilterResult && customSearchResult;
    },
  ), [
    queryValue,
    queryField,
    filterValues,
    dateValues,
    filters,
    customFilters,
    customSearches,
  ]);

  return {
    customFilterValue,
    changeCustomFilterValue,
    customSearchValue,
    changeCustomSearchValue,
    getDataSource,
    filterValues,
    changeFilterValue: onFilterValueChange,
    openCreator,
    closeCreator,
    openEditor,
    closeEditor,
    openDetails,
    closeDetails,
    reset: onReset,
    pagination: {
      showTotal: ((total) => `共 ${total} 条`) as ShowTotal,
      pageSize,
      onChange: onPageChange,
      current: currentPage,
      ...pagination,
    },
    tableHeader: <RelientTableHeader<RecordType, CreatorValues, EditorValues, CreatorSubmitReturn, EditorSubmitReturn>
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
        name: 'editor',
        ...editor,
        initialValues: getEditorInitialValues
          ? getEditorInitialValues(editItem)
          : editItem as Partial<EditorValues>,
        onSubmit: onEditorSubmit,
        open: editorOpen,
        onClose: closeEditor,
      }}
      details={details && {
        ...details,
        dataSource: getDetailsDataSource
          ? getDetailsDataSource(detailsItem!)
          : detailsItem,
        open: detailsOpen,
        close: closeDetails,
      }}
      creator={creator && {
        name: 'creator',
        ...creator,
        onSubmit: onCreatorSubmit,
        open: creatorOpen,
        onClose: closeCreator,
      }}
      openEditor={openEditor}
      openCreator={openCreator}
      resetButton={resetButton ? {
        onClick: onReset,
        ...(typeof resetButton === 'boolean' ? {} : resetButton),
      } : undefined}
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
