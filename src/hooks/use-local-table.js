import React, { useCallback } from 'react';
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
import TableHeader from '../components/table-header';
import { useBasicTable } from './utils';

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
//   creator: {
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
//     title: string,
//     initialValues: object,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     getFields: func,
//     component: ReactComponent,
//     checkEditing: bool,
//     checkingMessage: string,
//   },
// })

export default ({
  query: { onFieldChange, onValueChange, fields, width, fussy } = {},
  showReset,
  filters = [],
  createLink,
  datePickers,
  creator: {
    onSubmit: createSubmit,
    checkEditing: creatorCheckEditing,
    checkingMessage: creatorCheckingMessage,
  } = {},
  creator,
  editor: {
    onSubmit: editSubmit,
    checkEditing: editorCheckEditing,
    checkingMessage: editorCheckingMessage,
  } = {},
  editor,
} = {}) => {
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
    creatorCheckEditing,
    editorCheckingMessage,
    editorCheckEditing,
  });

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
    setQueryValue(value);
  }, [
    onValueChange,
  ]);
  const onFilterValueChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onFilterChange'))(filters);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setFilterValues(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(filters));
  }, [
    filters,
  ]);
  const onDateChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onDateChange'))(datePickers);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setDates(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(dates));
  }, [
    datePickers,
    dates,
  ]);
  const onCreateSubmit = useCallback(async (values) => {
    await createSubmit(values);
    closeCreator();
    Message.success('创建成功');
  }, [
    createSubmit,
  ]);
  const onEditSubmit = useCallback(async (values) => {
    await editSubmit({ ...values, id: editItem.id }, values, editItem);
    closeEditor();
    Message.success('编辑成功');
  }, [
    editSubmit,
    editItem,
  ]);
  const getDataSource = useCallback(filter(
    (item) => {
      let queryResult = true;
      if (queryValue) {
        if (fussy) {
          queryResult = any(({ key }) => flow(
            prop(key),
            toUpper,
            includes(toUpper(queryValue)),
          )(item))(fields);
        } else if (queryField) {
          queryResult = flow(
            prop(queryField),
            toUpper,
            includes(toUpper(queryValue)),
          )(item);
        }
      }

      let filterResult = true;
      if (filters.length > 0) {
        filterResult = every(({ dataKey, value }) => value === '' || isNil(value) || propEq(dataKey, value)(item))(filters);
      }

      let datesResult = true;
      if (dates.length > 0) {
        datesResult = every(({ dataKey, value }) => {
          if (value && value.length > 1) {
            const selectedDate = prop(dataKey)(item);
            const [startDate, endDate] = value;
            return startDate.isBefore(selectedDate) && endDate.isAfter(selectedDate);
          }
          return true;
        })(dates);
      }

      return filterResult && queryResult && datesResult;
    },
  ), [
    queryValue,
    queryField,
    filters,
    dates,
  ]);

  return {
    getDataSource,
    filterValues,
    openEditor,
    reset,
    pagination: {
      showTotal: (total) => `总数 ${total}`,
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
      createLink={createLink}
      filter={{
        items: map(({
          dataKey,
          ...others
        }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(filters),
          ...others,
        }))(filters),
        onSelect: onFilterValueChange,
      }}
      editor={editor && {
        ...editor,
        initialValues: editItem,
        fields: editor.getFields ? editor.getFields(editItem) : editor.fields,
      }}
      creator={creator}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      creatorVisible={creatorVisible}
      editorVisible={editorVisible}
      openCreator={openCreator}
      closeCreator={closeCreator}
      closeEditor={closeEditor}
      reset={showReset ? reset : null}
      datePicker={{
        items: map(({ dataKey, ...others }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(dates),
          ...others,
        }))(datePickers),
        onSelect: onDateChange,
      }}
    />,
  };
};
