import type {
  AsyncThunk,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  useDispatch,
} from 'react-redux';

type AnyAsyncThunk = AsyncThunk<any, any, any>;

type BindThunkAction<T extends AnyAsyncThunk> = (arg: Parameters<T>[0]) => Promise<Parameters<T>[1]>;

const bindThunkAction = <T extends AnyAsyncThunk, D extends ThunkDispatch<any, any, any>>(
  actionCreator: T,
  dispatch: D,
): BindThunkAction<T> => (arg) => dispatch(actionCreator(arg)).unwrap();

export const useThunkAction = <T extends AnyAsyncThunk>(actionCreator: T) => {
  const dispatch = useDispatch();
  return useCallback(
    bindThunkAction(actionCreator, dispatch),
    [dispatch],
  );
};

export const useThunkActions = <T extends { [key: string]: AnyAsyncThunk }>(
  actionCreators: T,
): { [Key in keyof T]: BindThunkAction<T[Key]> } => {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      const array = Object.entries(actionCreators).map(
        ([key, asyncThunk]) => [key, bindThunkAction(asyncThunk, dispatch)],
      );
      return Object.fromEntries(array);
    },
    [dispatch],
  );
};
