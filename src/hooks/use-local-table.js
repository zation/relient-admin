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
import { Message } from 'antd';
import { useI18N } from 'relient/i18n';
import TableHeader from '../components/table-header';
import useBasicTable from './use-basic-table';
import { DEFAULT_SIZE } from '../constants/pagination';

// {
//   query: {
//     fields: [{ key, text }],
//     onValueChange: func,
//     onFieldChange: func,
//     width: number,
//     placeholder: string,
//     fussy: bool,
//   },
//   showReset: bool,
//   filters: [{
//     dataKey: string,
//     label: string,
//     options: [{ text: string, value: string }],
//     defaultValue: value,
//     dropdownMatchSelectWidth: bool,
//     onChange: func,
//     onFilter: func,
//     disabled: bool,
//   }],
//   createButton: { text: string, link: string, onClick: func },
//   datePickers: [{
//     dataKey: string,
//     label: string,
//     onChange: func,
//     disabledDate: func,
//   }],
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
//     title: string,
//     initialValues: object,
//     getInitialValues: func,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     getFields: func,
//     component: Drawer | Modal,
//     checkEditing: bool,
//     checkingMessage: string,
//     footer: func,
//     validate: func,
//     onClose: func,
//     onOpen: func,
//   },
//   pagination: { pageSize, showTotal }
// })

export default ({
  query: { onFieldChange, onValueChange, fields, width, fussy } = {},
  showReset,
  filters = [],
  createButton,
  datePickers,
  pagination,
  paginationInitialData: {
    current: initialCurrent = 1,
    size: initialSize = DEFAULT_SIZE,
  } = {},
  creator: {
    onSubmit: createSubmit,
    checkingMessage: creatorCheckingMessage,
    onClose: creatorOnClose,
    onOpen: creatorOnOpen,
  } = {},
  creator,
  editor: {
    onSubmit: editSubmit,
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
    creatorCheckingMessage,
    editorCheckingMessage,
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

  const [customQueries, changeCustomQueries] = useState([]);

  // value: string
  // field: string
  // onFilter: function
  const changeCustomQuery = useCallback((value, field, onFilter) => {
    const existingQuery = find(propEq('field', field))(customQueries);
    if (!existingQuery) {
      changeCustomQueries([...customQueries, { field, value, onFilter }]);
    } else if (!value) {
      changeCustomQueries(reject(propEq('field', field))(customQueries));
    } else if (existingQuery.value !== value) {
      changeCustomQueries(
        map((query) => (query.field === field
          ? { field, value, onFilter }
          : query))(customQueries),
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
  const onCreateSubmit = useCallback(async (values) => {
    await createSubmit(values);
    closeCreator();
    Message.success(i18n('createSuccess'));
  }, [
    createSubmit,
  ]);
  const onEditSubmit = useCallback(async (values) => {
    await editSubmit({ ...values, id: editItem.id }, values, editItem);
    closeEditor();
    Message.success(i18n('editSuccess'));
  }, [
    editSubmit,
    editItem,
  ]);
  const getDataSource = useCallback(filter(
    (item) => {
      let queryResult = true;
      if (queryValue) {
        const match = (key) => flow(
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
          return value === '' || isNil(value) || (onFilter ? onFilter(item, dataKey, value) : propEq(dataKey, value)(item));
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
      showTotal: (total) => `${i18n('totalPage', { total })}`,
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
          ...others
        }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(filterValues),
          ...others,
        }))(filters),
        onSelect: onFilterValueChange,
      }}
      editor={editor && {
        ...editor,
        initialValues: getEditorInitialValues
          ? getEditorInitialValues(editItem)
          : editItem,
      }}
      details={details && {
        ...details,
        dataSource: getDetailsDataSource
          ? getDataSource(detailsItem)
          : detailsItem,
      }}
      closeDetails={closeDetails}
      detailsVisible={detailsVisible}
      creator={creator}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      creatorVisible={creatorVisible}
      editorVisible={editorVisible}
      openEditor={openEditor}
      openCreator={openCreator}
      closeCreator={closeCreator}
      closeEditor={closeEditor}
      reset={showReset ? reset : null}
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
};
