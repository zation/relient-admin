import { useState, useCallback } from 'react';
import {
  first,
  flow,
  isUndefined,
  map,
  prop,
  reject,
} from 'lodash/fp';
import useDetails, { UseDetails } from './use-details';
import type { Option, Filter, FilterValue, DateValue } from '../interface';

export interface UseBasicTable<Item = any> extends UseDetails<Item> {
  fields: Option[] | null | undefined
  filters: Filter[] | null | undefined
  editorOnOpen?: (item: Item) => void
  editorOnClose?: () => void
  creatorOnOpen?: () => void
  creatorOnClose?: () => void
}

export default ({
  fields,
  filters,
  editorOnOpen,
  editorOnClose,
  creatorOnOpen,
  creatorOnClose,
  detailsOnOpen,
  detailsOnClose,
}: UseBasicTable) => {
  const defaultQueryField = flow(first, prop('key'))(fields);
  const defaultFilterValues = flow(
    reject(flow(prop('defaultValue'), isUndefined)),
    map(({ defaultValue, dataKey }) => ({
      dataKey,
      value: defaultValue,
    })),
  )(filters);
  const [dateValues, setDateValues] = useState<DateValue[]>([]);
  const [queryField, setQueryField] = useState(defaultQueryField);
  const [queryValue, setQueryValue] = useState('');
  const [filterValues, setFilterValues] = useState<FilterValue[]>(defaultFilterValues);
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

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
  }, [creatorOnClose]);
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
  }, [editorOnClose]);
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

  const {
    detailsItem,
    detailsVisible,
    openDetails,
    closeDetails,
  } = useDetails({ detailsOnOpen, detailsOnClose });

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
