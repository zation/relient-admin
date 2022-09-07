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
  reduce,
  reject,
  join,
  isArray,
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
  ID,
  DatePicker,
} from '../interface';

const omitEmpty = omitBy((val) => (isNil(val) || val === ''));

const getFilterParams = flow(
  keyBy('dataKey'),
  mapValues(({ value }: FilterValue) => {
    if (isArray(value)) {
      return join(',')(value);
    }
    return value;
  }),
);

const getDateParams = reduce((result, { dataKey, value }) => {
  if (value && value.length > 1) {
    return {
      ...result,
      [`${dataKey}After`]: value[0] ? new Date(value[0]).toISOString() : undefined,
      [`${dataKey}Before`]: value[1] ? new Date(value[1]).toISOString() : undefined,
    };
  }
  return result;
}, {});

export interface ReadActionParams {
  [key: string]: any

  size: number
  page: number
}

export interface ReadAction<Model> {
  (params: ReadActionParams): Promise<{
    content: Model[]
    number: number
    size: number
    totalElements: number
  }>
}

async function onFetch<Modal>(
  queryValue: string | null | undefined,
  queryField: string,
  readAction: ReadAction<Modal>,
  setPaginationData: (paginationData: PaginationData) => void,
  size: number,
  filterValues: FilterValue[],
  dateValues: DateValue[],
  page: number,
  setIsLoading: (isLoading: boolean) => void,
  fussyKey: string | null | undefined,
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

export interface UseApiTableParams<Model,
  CreatorValues,
  EditorValues,
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
  filters?: Filter<Model>[]
  createButton?: CreateButton
  resetButton?: ResetButton | boolean
  datePickers?: DatePicker[]
  getDataSource: (ids: ID[]) => Model[]
  pagination?: PaginationProps
  paginationInitialData: PaginationData
  readAction: ReadAction<Model>
  creator?: Creator<CreatorValues, CreatorSubmitReturn>
  editor?: Editor<Model, EditorValues, EditorSubmitReturn>
  details?: Details<Model>
}

export default function useApiTable<Model,
  CreatorValues = Omit<Model, 'id'>,
  EditorValues = Partial<Model>,
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
}: UseApiTableParams<Model, CreatorValues, EditorValues, CreatorSubmitReturn, EditorSubmitReturn>) {
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

  const [paginationData, setPaginationData] = useState<PaginationData>(paginationInitialData);
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
    reset,
    defaultQueryField,
    defaultFilterValues,
    openDetails,
    closeDetails,
    detailsVisible,
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
  ]);
  const onReset = useCallback(() => {
    reset();

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
    );
  }, [
    defaultQueryField,
    defaultFilterValues,
    initialCurrent,
    readAction,
    reset,
    fussyKey,
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
      );
    }
  }, [
    queryValue,
    queryField,
    readAction,
    paginationData.size,
    filterValues,
    dateValues,
    fussyKey,
    paginationData.current,
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
  ), [
    queryValue,
    queryField,
    readAction,
    paginationData.size,
    filterValues,
    dateValues,
    paginationData.current,
    fussyKey,
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
    paginationData.size,
    initialCurrent,
    filterValues,
    dateValues,
    fussyKey,
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
    pagination: {
      showTotal: ((total) => `共 ${total} 条`) as ShowTotal,
      pageSize: paginationData.size,
      current: paginationData.current + 1,
      total: paginationData.total,
      onChange: onPageChange,
      ...pagination,
    },
    tableHeader: <RelientTableHeader<Model, CreatorValues, EditorValues, CreatorSubmitReturn, EditorSubmitReturn>
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
        items: map<Filter<Model>, FilterItem>(({
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
        visible: detailsVisible,
        close: closeDetails,
      }}
      creator={creator && {
        name: 'creator',
        ...creator,
        onSubmit: onCreatorSubmit,
        visible: creatorVisible,
        onClose: closeCreator,
      }}
      editor={editor && {
        name: 'editor',
        ...editor,
        initialValues: getEditorInitialValues
          ? getEditorInitialValues(editItem)
          : editItem as Partial<EditorValues>,
        onSubmit: onEditorSubmit,
        visible: editorVisible,
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
