import {
  useState,
  useCallback,
  Key,
} from 'react';
import {
  clone,
  find,
  first,
  flow,
  isEqual,
  isUndefined,
  map,
  prop,
  propEq,
  reject,
  isArray,
} from 'lodash/fp';
import useDetails, { UseDetails } from './use-details';
import type { QueryField, Filter, FilterValue, DateValue } from '../interface';

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

export interface UseBasicTableParams<RecordType> extends UseDetails<RecordType> {
  fields: QueryField[] | null | undefined
  filters: Filter<RecordType>[] | null | undefined
  editorOnOpen?: (item: RecordType) => void
  editorOnClose?: () => void
  creatorOnOpen?: () => void
  creatorOnClose?: () => void
}

export default function useBasicTable<RecordType>({
  fields,
  filters,
  editorOnOpen,
  editorOnClose,
  creatorOnOpen,
  creatorOnClose,
  detailsOnOpen,
  detailsOnClose,
}: UseBasicTableParams<RecordType>) {
  const defaultQueryField = flow(first, prop<QueryField, 'dataKey'>('dataKey'))(fields);
  const defaultFilterValues = flow(
    reject(flow(prop('defaultValue'), isUndefined)),
    map(({ defaultValue, dataKey }: Filter<RecordType>) => ({
      dataKey,
      value: defaultValue,
    })),
  )(filters);
  const [dateValues, setDateValues] = useState<DateValue[]>([]);
  const [queryField, setQueryField] = useState(defaultQueryField);
  const [queryValue, setQueryValue] = useState('');
  const [filterValues, setFilterValues] = useState<FilterValue[]>(defaultFilterValues);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editItem, setEditItem] = useState<RecordType | undefined>();

  const openCreator = useCallback(() => {
    setCreatorOpen(true);
    if (creatorOnOpen) {
      creatorOnOpen();
    }
  }, [creatorOnOpen]);
  const closeCreator = useCallback(() => {
    setCreatorOpen(false);
    if (creatorOnClose) {
      creatorOnClose();
    }
  }, [creatorOnClose]);
  const openEditor = useCallback((item: RecordType) => {
    setEditorOpen(true);
    setEditItem(item);
    if (editorOnOpen) {
      editorOnOpen(item);
    }
  }, [editorOnOpen]);
  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditItem(undefined);
    if (editorOnClose) {
      editorOnClose();
    }
  }, [editorOnClose]);
  const reset = useCallback(() => {
    setDateValues([]);
    setQueryField(defaultQueryField);
    setQueryValue('');
    setFilterValues(defaultFilterValues);
    setCreatorOpen(false);
    setEditorOpen(false);
    setEditItem(undefined);
  }, [
    defaultQueryField,
    defaultFilterValues,
  ]);

  const {
    detailsItem,
    detailsOpen,
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
    creatorOpen,
    editorOpen,
    editItem,
    openCreator,
    closeCreator,
    openEditor,
    closeEditor,
    reset,
    openDetails,
    closeDetails,
    detailsOpen,
    detailsItem,
  };
}
