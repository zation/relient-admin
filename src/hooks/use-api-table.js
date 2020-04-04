import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  concat,
  debounce,
  find,
  first,
  flow,
  isFunction,
  isNil,
  isUndefined,
  keyBy,
  map,
  mapValues,
  omitBy,
  prop,
  propEq,
  reduce,
  reject,
} from 'lodash/fp';
import { Message } from 'antd';
import TableHeader from '../components/table-header';
import { useBasicTable } from './utils';

const omitEmpty = omitBy((val) => (isNil(val) || val === ''));

const getFilterParams = flow(
  keyBy('dataKey'),
  mapValues(prop('value')),
);

const getDateParams = reduce((result, { dataKey, value }) => {
  if (value && value.length > 1) {
    return {
      ...result,
      [`${dataKey}After`]: new Date(value[0]).toISOString(),
      [`${dataKey}Before`]: new Date(value[1]).toISOString(),
    };
  }
  return result;
}, {});

const onFetch = async (
  queryValue,
  queryField,
  readAction,
  setPageData,
  originSize,
  filterValues,
  dates,
  page,
  setIsLoading,
  fussyKey,
) => {
  setIsLoading(true);
  const {
    content,
    number,
    size,
    totalElements,
  } = await readAction(omitEmpty({
    [fussyKey || queryField]: queryValue,
    size: originSize,
    page,
    ...getFilterParams(filterValues),
    ...getDateParams(dates),
  }));
  setIsLoading(false);
  setPageData({
    current: number,
    size,
    total: totalElements,
    ids: map(prop('id'))(content),
  });
};

const onQueryFetch = debounce(500, onFetch);

// {
//   query: {
//     fields: [{ key, text }],
//     onValueChange: func,
//     onFieldChange: func,
//     width: number,
//     placeholder: string,
//     fussyKey: string,
//   },
//   showReset: bool,
//   filters: [{
//     dataKey: string,
//     label: string,
//     options: [{ text: string, value: string }],
//     defaultValue: value,
//     dropdownMatchSelectWidth: bool,
//     onFilterChange: func,
//     disabled: bool,
//   }],
//   createLink: { text: string, link: string },
//   datePickers: [{
//     dataKey: string,
//     label: string,
//     onDateChange: func,
//     disabledDate: func,
//   }],
//   pagination: { size: number, getDataSource: func },
//   paginationInitialData: {
//     ids: array,
//     current: number,
//     size: number,
//     total: number
//   },
//   readAction: func,
//   creator: {
//     formName: string,
//     title: string,
//     initialValues: object,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     component: ReactComponent,
//     checkEditing: bool,
//     checkingMessage: string,
//   },
//   editor: {
//     formName: string,
//     title: string,
//     initialValues: object,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     shouldReload: bool,
//     getFields: func,
//     component: ReactComponent,
//     checkEditing: bool,
//     checkingMessage: string,
//   },
// }

export default ({
  query: { onFieldChange, onValueChange, fields, width, placeholder, fussyKey } = {},
  showReset,
  filters,
  createLink,
  datePickers,
  pagination: { getDataSource, size },
  paginationInitialData,
  readAction,
  creator: {
    onSubmit: createSubmit,
    checkingMessage: creatorCheckingMessage,
  } = {},
  creator,
  editor: {
    onSubmit: editSubmit,
    shouldReload,
    checkingMessage: editorCheckingMessage,
  } = {},
  editor,
} = {}) => {
  const defaultQueryField = flow(first, prop('key'))(fields);
  const defaultFilterValues = flow(
    reject(flow(prop('defaultValue'), isUndefined)),
    map(({ defaultValue, dataKey }) => ({
      dataKey,
      value: defaultValue,
    })),
  )(filters);
  const [pageData, setPageData] = useState(paginationInitialData);
  const data = useSelector((state) => getDataSource(state)(pageData.ids));
  const [isLoading, setIsLoading] = useState(false);

  const {
    dates,
    setDates,
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
  } = useBasicTable({
    fields,
    filters,
    creatorCheckingMessage,
    editorCheckingMessage,
  });

  const onQueryFieldChange = useCallback(async (fieldKey) => {
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
      setPageData,
      size,
      filterValues,
      dates,
      0,
      setIsLoading,
      fussyKey,
    );
  }, [
    readAction,
    size,
    filterValues,
    dates,
    onFieldChange,
    onValueChange,
    fussyKey,
  ]);
  const onQueryValueChange = useCallback(({ target: { value } }) => {
    if (isFunction(onValueChange)) {
      onValueChange(value);
    }
    setQueryValue(value);
    onQueryFetch(
      value,
      queryField,
      readAction,
      setPageData,
      size,
      filterValues,
      dates,
      0,
      setIsLoading,
      fussyKey,
    );
  }, [
    onValueChange,
    queryField,
    readAction,
    size,
    filterValues,
    dates,
    fussyKey,
  ]);
  const onFilterValueChange = useCallback(async (value, dataKey) => {
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
    )(filters);
    setFilterValues(newFilterValues);
    await onFetch(
      queryValue,
      queryField,
      readAction,
      setPageData,
      size,
      newFilterValues,
      dates,
      0,
      setIsLoading,
      fussyKey,
    );
  }, [
    filters,
    queryValue,
    queryField,
    readAction,
    size,
    dates,
    fussyKey,
  ]);
  const onDateChange = useCallback(async (value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onDateChange'))(datePickers);
    if (isFunction(onChange)) {
      onChange(value);
    }
    const newDates = flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(dates);
    setDates(newDates);
    await onFetch(
      queryValue,
      queryField,
      readAction,
      setPageData,
      size,
      filterValues,
      newDates,
      0,
      setIsLoading,
      fussyKey,
    );
  }, [
    datePickers,
    dates,
    queryValue,
    queryField,
    readAction,
    size,
    filterValues,
    fussyKey,
  ]);
  const onReset = useCallback(async () => {
    reset();

    await onFetch(
      null,
      defaultQueryField,
      readAction,
      setPageData,
      size,
      defaultFilterValues,
      [],
      0,
      setIsLoading,
      fussyKey,
    );
  }, [
    defaultQueryField,
    defaultFilterValues,
    readAction,
    reset,
    fussyKey,
  ]);
  const onPageChange = useCallback((page) => onFetch(
    queryValue,
    queryField,
    readAction,
    setPageData,
    size,
    filterValues,
    dates,
    page - 1,
    setIsLoading,
    fussyKey,
  ), [
    queryValue,
    queryField,
    readAction,
    size,
    filterValues,
    dates,
    fussyKey,
  ]);
  const onReload = useCallback(() => onFetch(
    queryValue,
    queryField,
    readAction,
    setPageData,
    size,
    filterValues,
    dates,
    pageData.current,
    setIsLoading,
    fussyKey,
  ), [
    queryValue,
    queryField,
    readAction,
    size,
    filterValues,
    dates,
    pageData.current,
    fussyKey,
  ]);
  const onCreateSubmit = useCallback(async (values) => {
    await createSubmit(values);
    await onFetch(
      queryValue,
      queryField,
      readAction,
      setPageData,
      size,
      filterValues,
      dates,
      0,
      setIsLoading,
      fussyKey,
    );
    closeCreator();
    Message.success('创建成功');
  }, [
    createSubmit,
    queryValue,
    queryField,
    readAction,
    size,
    filterValues,
    dates,
    fussyKey,
  ]);
  const onEditSubmit = useCallback(async (values) => {
    await editSubmit({ ...values, id: editItem.id }, values, editItem);
    if (shouldReload) {
      await onReload();
    }
    closeEditor();
    Message.success('编辑成功');
  }, [
    editSubmit,
    editItem,
    shouldReload,
    onReload,
  ]);

  return {
    data,
    openEditor,
    reload: onReload,
    reset: onReset,
    isLoading,
    pagination: {
      showTotal: (total) => `总数 ${total}`,
      pageSize: pageData.size,
      current: pageData.current + 1,
      total: pageData.total,
      onChange: onPageChange,
    },
    filterValues,
    tableHeader: <TableHeader
      query={{
        onFieldChange: onQueryFieldChange,
        onValueChange: onQueryValueChange,
        value: queryValue,
        field: queryField,
        fields,
        width,
        placeholder,
        fussy: !!fussyKey,
      }}
      createLink={createLink}
      filter={{
        items: flow(
          reject(propEq('staticField', true)),
          map(({
            dataKey,
            ...others
          }) => ({
            dataKey,
            value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(filters),
            ...others,
          })),
        )(filters),
        onSelect: onFilterValueChange,
      }}
      datePicker={{
        items: map(({ dataKey, ...others }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(dates),
          ...others,
        }))(datePickers),
        onSelect: onDateChange,
      }}
      creator={creator}
      editor={editor && {
        ...editor,
        initialValues: editItem,
        fields: editor.getFields ? editor.getFields(editItem) : editor.fields,
      }}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      creatorVisible={creatorVisible}
      editorVisible={editorVisible}
      openCreator={openCreator}
      closeCreator={closeCreator}
      closeEditor={closeEditor}
      reset={showReset ? onReset : null}
    />,
  };
};
