import { useState, useCallback } from 'react';
import {
  first,
  flow,
  isUndefined,
  map,
  prop,
  reject,
} from 'lodash/fp';

export default ({
  fields,
  filters,
  creatorCheckingMessage,
  editorCheckingMessage,
}) => {
  const defaultQueryField = flow(first, prop('key'))(fields);
  const defaultFilterValues = flow(
    reject(flow(prop('defaultValue'), isUndefined)),
    map(({ defaultValue, dataKey }) => ({
      dataKey,
      value: defaultValue,
    })),
  )(filters);
  const [dateValues, setDateValues] = useState([]);
  const [queryField, setQueryField] = useState(defaultQueryField);
  const [queryValue, setQueryValue] = useState('');
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const openCreator = useCallback(() => setCreatorVisible(true), []);
  const closeCreator = useCallback(() => {
    if (global.isFormEditing) {
      if (global.confirm(creatorCheckingMessage || '确认离开正在编辑的表单吗？')) {
        setCreatorVisible(false);
      }
    } else {
      setCreatorVisible(false);
    }
  }, [creatorCheckingMessage]);
  const openEditor = useCallback((item) => {
    setEditorVisible(true);
    setEditItem(item);
  }, []);
  const closeEditor = useCallback(() => {
    if (global.isFormEditing) {
      if (global.confirm(editorCheckingMessage || '确认离开正在编辑的表单吗？')) {
        setEditorVisible(false);
        setEditItem(null);
      }
    } else {
      setEditorVisible(false);
      setEditItem(null);
    }
  }, [editorCheckingMessage]);
  const reset = useCallback(async () => {
    setDateValues([]);
    setQueryField(defaultQueryField);
    setQueryValue('');
    setFilterValues(defaultFilterValues);
    setCreatorVisible(false);
    setEditorVisible(false);
    setEditItem(null);
  }, [
    defaultQueryField,
    defaultFilterValues,
  ]);

  return {
    defaultFilterValues,
    defaultQueryField,
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
  };
};
