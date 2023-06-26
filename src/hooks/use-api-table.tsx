import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEventHandler,
} from 'react';
import {
  concat,
  debounce,
  find,
  flow,
  isFunction,
  isNil,
  keyBy,
  map,
  mapValues,
  omitBy,
  prop,
  propEq,
  reject,
  join,
} from 'lodash/fp';
import {
  FormInstance,
  message,
  PaginationProps,
} from 'antd';
import RelientTableHeader, {
  CreateButton,
  FilterItem,
  ResetButton,
} from '../components/table-header';
import useBasicTable, { isFilterValuesSame } from './use-basic-table';
import type {
  QueryField,
  Filter,
  FilterValue,
  DateValue,
  ShowTotal,
  Creator,
  Details,
  Editor,
  PaginationData,
  RecordTypeId,
  DatePicker,
  ChangeCustomSearchValue,
} from '../interface';
import { PagedData } from '../utils/pagination';
import {
  CustomFilter,
  CustomSearch,
  CustomSearchValue,
} from '../interface';

const omitEmpty = omitBy((val) => (isNil(val) || val === ''));

const getFilterParams = flow(
  keyBy('dataKey'),
  mapValues(flow(prop('value'), join(','))),
);

const getDateParams = (dateValues: DateValue[]) => dateValues.reduce((result, { dataKey, value }) => {
  if (value && value.length > 1) {
    return {
      ...result,
      [`${dataKey}After`]: value[0] ? value[0].toISOString() : undefined,
      [`${dataKey}Before`]: value[1] ? value[1].toISOString() : undefined,
    };
  }
  return result;
}, {});

export interface ReadActionParams {
  [key: string]: any

  size: number
  page: number
}

export interface ReadAction {
  (params: ReadActionParams): Promise<PagedData<any>>
}

async function onFetch<RecordType>(
  queryValue: string | null | undefined,
  queryField: string,
  readAction: ReadAction,
  setPaginationData: (paginationData: PaginationData<RecordType>) => void,
  size: number,
  filterValues: FilterValue[],
  dateValues: DateValue[],
  page: number,
  setIsLoading: (isLoading: boolean) => void,
  fussyKey: string | null | undefined,
  customSearchValue: CustomSearchValue,
) {
  setIsLoading(true);
  const {
    content,
    number,
    size: newSize,
    totalElements,
  } = await readAction(omitEmpty({
    [fussyKey || queryField]: queryValue,
    size,
    page,
    ...getFilterParams(filterValues),
    ...getDateParams(dateValues),
    ...customSearchValue,
  }) as ReadActionParams);
  setIsLoading(false);
  setPaginationData({
    current: number,
    size: newSize,
    total: totalElements,
    ids: map(prop('id'))(content),
  });
}

const onQueryFetch = debounce(500, onFetch);

export interface UseApiTableParams<RecordType,
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
    fussyKey?: string
    searchWhenValueChange?: boolean
  }
  filters?: Filter<RecordType>[]
  customFilters?: CustomFilter<RecordType>[]
  customSearches?: CustomSearch<RecordType>[]
  createButton?: CreateButton
  resetButton?: ResetButton | boolean
  datePickers?: DatePicker[]
  getDataSource: (ids: RecordTypeId<RecordType>[]) => RecordType[]
  pagination?: PaginationProps
  paginationInitialData: PaginationData<RecordType>
  readAction: ReadAction
  creator?: Creator<CreatorValues, CreatorSubmitReturn>
  editor?: Editor<RecordType, EditorValues, EditorSubmitReturn>
  details?: Details<RecordType>
}

export default function useApiTable<RecordType,
  CreatorValues = Omit<RecordType, 'id'>,
  EditorValues = Partial<RecordType>,
  CreatorSubmitReturn = any,
  EditorSubmitReturn = any>({
  query,
  filters,
  createButton,
  datePickers,
  getDataSource,
  pagination,
  paginationInitialData,
  paginationInitialData: {
    current: initialCurrent,
    total: initialTotal,
    ids: initialIds,
    size: initialSize,
  },
  readAction,
  creator,
  editor,
  details,
  resetButton,
}: UseApiTableParams<RecordType, CreatorValues, EditorValues, CreatorSubmitReturn, EditorSubmitReturn>) {
  const {
    onFieldChange,
    onValueChange,
    fields,
    width,
    placeholder,
    fussyKey,
    searchWhenValueChange = true,
  } = query || {};
  const {
    onSubmit: creatorSubmit,
    onClose: creatorOnClose,
    onOpen: creatorOnOpen,
    successMessage: creatorSuccessMessage,
  } = creator || {};
  const {
    onSubmit: editorSubmit,
    shouldReload,
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

  const [paginationData, setPaginationData] = useState<PaginationData<RecordType>>(paginationInitialData);
  useEffect(() => {
    if (initialCurrent !== paginationData.current
      || initialTotal !== paginationData.total
      || join(',')(initialIds) !== join(',')(paginationData.ids)
      || initialSize !== paginationData.size) {
      setPaginationData(paginationInitialData);
    }
  }, [initialSize, initialCurrent, initialTotal, join(',')(initialIds)]);
  const dataSource = getDataSource(paginationData.ids);
  const [isLoading, setIsLoading] = useState(false);
  const [customSearchValue, setCustomSearchValue] = useState<CustomSearchValue>({});

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
    reset,
    defaultQueryField,
    defaultFilterValues,
    openDetails,
    closeDetails,
    detailsOpen,
    detailsItem,
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

  const onQueryFieldChange = useCallback(async (fieldKey: string) => {
    setQueryField(fieldKey);
    setQueryValue('');
    if (isFunction(onFieldChange)) {
      onFieldChange(fieldKey);
    }
    if (isFunction(onValueChange)) {
      onValueChange('');
    }
    await onFetch(
      null,
      fieldKey,
      readAction,
      setPaginationData,
      paginationData.size,
      filterValues,
      dateValues,
      initialCurrent,
      setIsLoading,
      fussyKey,
      customSearchValue,
    );
  }, [
    readAction,
    paginationData.size,
    initialCurrent,
    filterValues,
    dateValues,
    onFieldChange,
    onValueChange,
    fussyKey,
    customSearchValue,
  ]);
  const onSearch = useCallback(() => {
    if (!searchWhenValueChange) {
      onFetch(
        queryValue,
        queryField,
        readAction,
        setPaginationData,
        paginationData.size,
        filterValues,
        dateValues,
        initialCurrent,
        setIsLoading,
        fussyKey,
        customSearchValue,
      );
    }
  }, [
    queryValue,
    queryField,
    readAction,
    setPaginationData,
    paginationData.size,
    filterValues,
    dateValues,
    initialCurrent,
    setIsLoading,
    fussyKey,
    customSearchValue,
  ]);
  const onQueryValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(({ target: { value } }) => {
    if (isFunction(onValueChange)) {
      onValueChange(value);
    }
    setQueryValue(value);
    if (searchWhenValueChange) {
      onQueryFetch(
        value,
        queryField,
        readAction,
        setPaginationData,
        paginationData.size,
        filterValues,
        dateValues,
        initialCurrent,
        setIsLoading,
        fussyKey,
        customSearchValue,
      );
    }
  }, [
    onValueChange,
    queryField,
    readAction,
    paginationData.size,
    initialCurrent,
    filterValues,
    dateValues,
    fussyKey,
    searchWhenValueChange,
    customSearchValue,
  ]);
  const onFilterValueChange = useCallback(async (value: FilterValue['value'], dataKey: FilterValue['dataKey']) => {
    if (isFilterValuesSame(value, dataKey, filterValues)) {
      return null;
    }
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onFilterChange'))(filters);
    if (isFunction(onChange)) {
      onChange(value);
    }
    const newFilterValues = flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(filterValues);
    setFilterValues(newFilterValues);
    return onFetch(
      queryValue,
      queryField,
      readAction,
      setPaginationData,
      paginationData.size,
      newFilterValues,
      dateValues,
      initialCurrent,
      setIsLoading,
      fussyKey,
      customSearchValue,
    );
  }, [
    filters,
    queryValue,
    queryField,
    readAction,
    paginationData.size,
    initialCurrent,
    dateValues,
    fussyKey,
    filterValues,
    customSearchValue,
  ]);
  const onDateChange = useCallback(async (value: DateValue['value'], dataKey: DateValue['dataKey']) => {
    if (flow(
      find<FilterValue>(propEq('dataKey')(dataKey)),
      propEq('value', value),
    )(filterValues)) {
      return null;
    }
    const onChange = flow(find<DatePicker>(propEq('dataKey', dataKey)), prop('onDateChange'))(datePickers);
    if (isFunction(onChange)) {
      onChange(value);
    }
    const newDates = flow(
      reject<DateValue>(propEq('dataKey')(dataKey)),
      concat<DateValue>({
        dataKey,
        value,
      }),
    )(dateValues);
    setDateValues(newDates);
    return onFetch(
      queryValue,
      queryField,
      readAction,
      setPaginationData,
      paginationData.size,
      filterValues,
      newDates,
      initialCurrent,
      setIsLoading,
      fussyKey,
      customSearchValue,
    );
  }, [
    datePickers,
    dateValues,
    queryValue,
    queryField,
    readAction,
    paginationData.size,
    initialCurrent,
    filterValues,
    fussyKey,
    customSearchValue,
  ]);
  const onReset = useCallback(() => {
    reset();
    setCustomSearchValue({});

    onFetch(
      null,
      defaultQueryField,
      readAction,
      setPaginationData,
      paginationData.size,
      defaultFilterValues,
      [],
      initialCurrent,
      setIsLoading,
      fussyKey,
      {},
    );
  }, [
    defaultQueryField,
    readAction,
    setPaginationData,
    paginationData.size,
    defaultFilterValues,
    initialCurrent,
    reset,
    fussyKey,
    setIsLoading,
  ]);
  const onPageChange = useCallback((page: number, pageSize: number) => {
    const { current, size } = paginationData;
    if (current !== page - 1 || size !== pageSize) {
      onFetch(
        queryValue,
        queryField,
        readAction,
        setPaginationData,
        pageSize,
        filterValues,
        dateValues,
        page - 1,
        setIsLoading,
        fussyKey,
        customSearchValue,
      );
    }
  }, [
    paginationData.size,
    paginationData.current,
    queryValue,
    queryField,
    readAction,
    setPaginationData,
    filterValues,
    dateValues,
    setIsLoading,
    fussyKey,
    customSearchValue,
  ]);
  const onReload = useCallback((page = paginationData.current) => onFetch(
    queryValue,
    queryField,
    readAction,
    setPaginationData,
    paginationData.size,
    filterValues,
    dateValues,
    page,
    setIsLoading,
    fussyKey,
    customSearchValue,
  ), [
    queryValue,
    queryField,
    readAction,
    setPaginationData,
    paginationData.size,
    filterValues,
    dateValues,
    paginationData.current,
    fussyKey,
    setIsLoading,
    customSearchValue,
  ]);
  const onCreatorSubmit = useCallback(async (values: CreatorValues, formInstance: FormInstance<CreatorValues>) => {
    const submitReturn = await creatorSubmit!(values, formInstance);
    await onFetch(
      queryValue,
      queryField,
      readAction,
      setPaginationData,
      paginationData.size,
      filterValues,
      dateValues,
      initialCurrent,
      setIsLoading,
      fussyKey,
      customSearchValue,
    );
    closeCreator();
    if (typeof creatorSuccessMessage === 'string') {
      message.success(creatorSuccessMessage);
    } else if (creatorSuccessMessage !== false) {
      message.success('创建成功');
    }
    return submitReturn;
  }, [
    creatorSubmit,
    queryValue,
    queryField,
    readAction,
    setPaginationData,
    paginationData.size,
    initialCurrent,
    setIsLoading,
    filterValues,
    dateValues,
    fussyKey,
    customSearchValue,
  ]);
  const onEditorSubmit = useCallback(async (values: EditorValues, formInstance: FormInstance<EditorValues>) => {
    const submitReturn = await editorSubmit!(values, formInstance, editItem!);
    if (shouldReload) {
      await onReload();
    }
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
    shouldReload,
    onReload,
  ]);
  const changeCustomSearchValue: ChangeCustomSearchValue = useCallback((value, dataKey) => {
    setCustomSearchValue((previous) => {
      const newValue = {
        ...previous,
        [dataKey]: value,
      };
      onFetch(
        queryValue,
        queryField,
        readAction,
        setPaginationData,
        paginationData.size,
        filterValues,
        dateValues,
        paginationData.current,
        setIsLoading,
        fussyKey,
        newValue,
      );
      return newValue;
    });
  }, [
    queryValue,
    queryField,
    readAction,
    setPaginationData,
    paginationData.size,
    filterValues,
    dateValues,
    paginationData.current,
    setIsLoading,
    fussyKey,
  ]);

  return {
    dataSource,
    openCreator,
    closeCreator,
    openEditor,
    closeEditor,
    openDetails,
    closeDetails,
    reload: onReload,
    reset: onReset,
    isLoading,
    filterValues,
    changeFilterValue: onFilterValueChange,
    changeDate: onDateChange,
    changeCustomSearchValue,
    customSearchValue,
    pagination: {
      showTotal: ((total) => `共 ${total} 条`) as ShowTotal,
      pageSize: paginationData.size,
      current: paginationData.current + 1,
      total: paginationData.total,
      onChange: onPageChange,
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
        placeholder,
        fussy: !!fussyKey,
        onSearch,
      }}
      createButton={createButton}
      filter={{
        items: map<Filter<RecordType>, FilterItem>(({
          dataKey,
          options,
          ...others
        }) => ({
          dataKey,
          value: flow(find<FilterValue>(propEq('dataKey')(dataKey)), prop<FilterValue, 'value'>('value'))(filterValues),
          options,
          ...others,
        }))(filters),
        onSelect: onFilterValueChange,
      }}
      datePicker={{
        items: map(({ dataKey, ...others }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(dateValues),
          ...others,
        }))(datePickers),
        onSelect: onDateChange,
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
      openEditor={openEditor}
      openCreator={openCreator}
      resetButton={resetButton ? {
        onClick: onReset,
        ...(typeof resetButton === 'boolean' ? {} : resetButton),
      } : undefined}
    />,
  };
}
