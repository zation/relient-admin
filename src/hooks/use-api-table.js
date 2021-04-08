import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
} from 'lodash/fp';
import { Message } from 'antd';
import { useI18N } from 'relient/i18n';
import { DEFAULT_PAGE } from '../constants/pagination';
import TableHeader from '../components/table-header';
import useBasicTable from './use-basic-table';

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
  size,
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
    size: newSize,
    totalElements,
  } = await readAction(omitEmpty({
    [fussyKey || queryField]: queryValue,
    size,
    page,
    ...getFilterParams(filterValues),
    ...getDateParams(dates),
  }));
  setIsLoading(false);
  setPageData({
    current: number,
    size: newSize,
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
//   createButton: { text: string, link: string, onClick: func },
//   datePickers: [{
//     dataKey: string,
//     label: string,
//     onDateChange: func,
//     disabledDate: func,
//   }],
//   getDataSource: func,
//   pagination: { size: number, showTotal: func },
//   paginationInitialData: {
//     ids: array,
//     current: number,
//     size: number,
//     total: number
//   },
//   readAction: func,
//   details: {
//     title: string,
//     editable: object,
//     items: array,
//     itemTitleStyle: object,
//     itemDataStyle: object,
//     editButtonText: string,
//     children: node,
//     level: string or array,
//     levelMove: number or array or func,
//     id: string,
//     onClose: func,
//     onOpen: func,
//     getDataSource: func,
//   },
//   creator: {
//     formName: string,
//     title: string,
//     initialValues: object,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     component: Drawer | Modal,
//     checkEditing: bool,
//     checkingMessage: string,
//     footer: func,
//     validate: func,
//     onClose: func,
//     onOpen: func,
//   },
//   editor: {
//     formName: string,
//     title: string,
//     initialValues: object,
//     getInitialValues: func,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     shouldReload: bool,
//     getFields: func,
//     component: Drawer | Modal,
//     checkEditing: bool,
//     checkingMessage: string,
//     footer: func,
//     validate: func,
//     onClose: func,
//     onOpen: func,
//   },
// }

export default ({
  query: { onFieldChange, onValueChange, fields, width, placeholder, fussyKey } = {},
  showReset,
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
  creator: {
    onSubmit: creatorSubmit,
    checkingMessage: creatorCheckingMessage,
    onClose: creatorOnClose,
    onOpen: creatorOnOpen,
  } = {},
  creator,
  editor: {
    onSubmit: editorSubmit,
    shouldReload,
    checkingMessage: editorCheckingMessage,
    onClose: editorOnClose,
    onOpen: editorOnOpen,
    getInitialValues: getEditorInitialValues,
  } = {},
  editor,
  details,
  details: {
    getDataSource: getDetailsDataSource,
    onOpen: detailsOnOpen,
    onClose: detailsOnClose,
  } = {},
} = {}) => {
  const [pageData, setPageData] = useState(paginationInitialData);
  useEffect(() => {
    if (initialCurrent !== pageData.current
      || initialTotal !== pageData.total
      || join(',')(initialIds) !== join(',')(pageData.ids)
      || initialSize !== pageData.size) {
      setPageData(paginationInitialData);
    }
  }, [initialSize, initialCurrent, initialTotal, join(',')(initialIds)]);
  const data = useSelector((state) => getDataSource(state)(pageData.ids));
  const [isLoading, setIsLoading] = useState(false);
  const i18n = useI18N();

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
    creatorCheckingMessage,
    editorCheckingMessage,
    editorOnOpen,
    editorOnClose,
    creatorOnOpen,
    creatorOnClose,
    detailsOnClose,
    detailsOnOpen,
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
      pageData.size,
      filterValues,
      dateValues,
      DEFAULT_PAGE,
      setIsLoading,
      fussyKey,
    );
  }, [
    readAction,
    pageData.size,
    filterValues,
    dateValues,
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
      pageData.size,
      filterValues,
      dateValues,
      DEFAULT_PAGE,
      setIsLoading,
      fussyKey,
    );
  }, [
    onValueChange,
    queryField,
    readAction,
    pageData.size,
    filterValues,
    dateValues,
    fussyKey,
  ]);
  const onFilterValueChange = useCallback(async (value, dataKey) => {
    if (flow(
      find(propEq('dataKey')(dataKey)),
      propEq('value', value),
    )(filterValues)) {
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
      setPageData,
      pageData.size,
      newFilterValues,
      dateValues,
      DEFAULT_PAGE,
      setIsLoading,
      fussyKey,
    );
  }, [
    filters,
    queryValue,
    queryField,
    readAction,
    pageData.size,
    dateValues,
    fussyKey,
    filterValues,
  ]);
  const onDateChange = useCallback(async (value, dataKey) => {
    if (flow(
      find(propEq('dataKey')(dataKey)),
      propEq('value', value),
    )(filterValues)) {
      return null;
    }
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
    )(dateValues);
    setDateValues(newDates);
    return onFetch(
      queryValue,
      queryField,
      readAction,
      setPageData,
      pageData.size,
      filterValues,
      newDates,
      DEFAULT_PAGE,
      setIsLoading,
      fussyKey,
    );
  }, [
    datePickers,
    dateValues,
    queryValue,
    queryField,
    readAction,
    pageData.size,
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
      pageData.size,
      defaultFilterValues,
      [],
      DEFAULT_PAGE,
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
  const onPageChange = useCallback((page, pageSize) => {
    const { current, size } = pageData;
    if (current !== page - 1 || size !== pageSize) {
      onFetch(
        queryValue,
        queryField,
        readAction,
        setPageData,
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
    pageData.size,
    filterValues,
    dateValues,
    fussyKey,
    pageData.current,
  ]);
  const onReload = useCallback(() => onFetch(
    queryValue,
    queryField,
    readAction,
    setPageData,
    pageData.size,
    filterValues,
    dateValues,
    pageData.current,
    setIsLoading,
    fussyKey,
  ), [
    queryValue,
    queryField,
    readAction,
    pageData.size,
    filterValues,
    dateValues,
    pageData.current,
    fussyKey,
  ]);
  const onCreatorSubmit = useCallback(async (values) => {
    await creatorSubmit(values);
    await onFetch(
      queryValue,
      queryField,
      readAction,
      setPageData,
      pageData.size,
      filterValues,
      dateValues,
      DEFAULT_PAGE,
      setIsLoading,
      fussyKey,
    );
    closeCreator();
    Message.success(i18n('createSuccess'));
  }, [
    creatorSubmit,
    queryValue,
    queryField,
    readAction,
    pageData.size,
    filterValues,
    dateValues,
    fussyKey,
  ]);
  const onEditorSubmit = useCallback(async (values) => {
    await editorSubmit({ ...values, id: editItem.id }, values, editItem);
    if (shouldReload) {
      await onReload();
    }
    closeEditor();
    Message.success(i18n('editSuccess'));
  }, [
    editorSubmit,
    editItem,
    shouldReload,
    onReload,
  ]);

  return {
    data,
    openCreator,
    openEditor,
    openDetails,
    reload: onReload,
    reset: onReset,
    isLoading,
    filterValues,
    changeFilterValue: onFilterValueChange,
    changeDate: onDateChange,
    pagination: {
      showTotal: (total) => `${i18n('totalPage', { total })}`,
      pageSize: pageData.size,
      current: pageData.current + 1,
      total: pageData.total,
      onChange: onPageChange,
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
        placeholder,
        fussy: !!fussyKey,
      }}
      createButton={createButton}
      filter={{
        items: flow(
          reject(propEq('staticField', true)),
          map(({
            dataKey,
            ...others
          }) => ({
            dataKey,
            value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(filterValues),
            ...others,
          })),
        )(filters),
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
      editor={editor && {
        ...editor,
        initialValues: getEditorInitialValues
          ? getEditorInitialValues(editItem)
          : editItem,
        onSubmit: onEditorSubmit,
        visible: editorVisible,
        onClose: closeEditor,
      }}
      openEditor={openEditor}
      openCreator={openCreator}
      reset={showReset ? onReset : null}
    />,
  };
};
