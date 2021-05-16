import {
  useState,
  useCallback,
  Key,
} from 'react';
import {
  clone,
  find,
  first,
  flow, isEqual,
  isUndefined,
  map,
  prop, propEq,
  reject,
  isArray,
} from 'lodash/fp';
import useDetails, { UseDetails } from './use-details';
import type { Option, Filter, FilterValue, DateValue } from '../interface';

export const isFilterValuesSame = (
  value: Key[] | Key | undefined | null,
  dataKey: string,
  filterValues: FilterValue[],
) => flow(
  find(propEq('dataKey')(dataKey)),
  prop('value'),
  (oldValue) => {
    if (oldValue && value) {
      if (isArray(oldValue) && isArray(value)) {
        return isEqual(clone(oldValue).sort())(clone(value).sort());
      }
      return oldValue === value;
    }
    if (oldValue && !value) {
      return false;
    }
    if (!oldValue && value) {
      return false;
    }
    return true;
  },
)(filterValues);

export interface UseBasicTableParams<Item> extends UseDetails<Item> {
  fields: Option[] | null | undefined
  filters: Filter<Item>[] | null | undefined
  editorOnOpen?: (item: Item) => void
  editorOnClose?: () => void
  creatorOnOpen?: () => void
  creatorOnClose?: () => void
}

export default function useBasicTable<Model>({
  fields,
  filters,
  editorOnOpen,
  editorOnClose,
  creatorOnOpen,
  creatorOnClose,
  detailsOnOpen,
  detailsOnClose,
}: UseBasicTableParams<Model>) {
  const defaultQueryField = flow(first, prop('dataKey'))(fields);
  const defaultFilterValues = flow(
    reject(flow(prop('defaultValue'), isUndefined)),
    map(({ defaultValue, dataKey }: Filter<Model>) => ({
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
  const reset = useCallback(() => {
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
}
