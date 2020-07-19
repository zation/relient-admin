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
  editorOnOpen,
  editorOnClose,
  creatorOnOpen,
  creatorOnClose,
  detailsOnOpen,
  detailsOnClose,
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
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);

  const openCreator = useCallback(() => {
    setCreatorVisible(true);
    if (creatorOnOpen) {
      creatorOnOpen();
    }
  }, [creatorOnOpen]);
  const closeCreator = useCallback(() => {
    setCreatorVisible(false);
    if (creatorOnClose) {
      creatorOnClose();
    }
  }, [creatorCheckingMessage, creatorOnClose]);
  const openEditor = useCallback((item) => {
    setEditorVisible(true);
    setEditItem(item);
    if (editorOnOpen) {
      editorOnOpen(item);
    }
  }, [editorOnOpen]);
  const closeEditor = useCallback(() => {
    setEditorVisible(false);
    setEditItem(null);
    if (editorOnClose) {
      editorOnClose();
    }
  }, [editorCheckingMessage, editorOnClose]);
  const openDetails = useCallback((item) => {
    setDetailsVisible(true);
    setDetailsItem(item);
    if (detailsOnOpen) {
      detailsOnOpen(item);
    }
  }, [detailsOnOpen]);
  const closeDetails = useCallback(() => {
    setDetailsVisible(false);
    setDetailsItem(null);
    if (detailsOnClose) {
      detailsOnClose();
    }
  }, []);
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
    openDetails,
    closeDetails,
    detailsVisible,
    detailsItem,
  };
};
