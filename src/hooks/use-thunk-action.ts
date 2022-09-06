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

type GetReturned<T> = T extends AsyncThunk<infer Returned, any, any> ? Returned : never;
type GetThunkArg<T> = T extends AsyncThunk<any, infer ThunkArg, any> ? ThunkArg : never;

const bindThunkAction = <T extends AsyncThunk<any, any, any>, D extends ThunkDispatch<any, any, any>>(
  actionCreator: T,
  dispatch: D,
) => (arg: GetThunkArg<T>): Promise<GetReturned<T>> => dispatch(actionCreator(arg)).unwrap();

export const useThunkAction = <T extends AsyncThunk<any, any, any>>(actionCreator: T) => {
  const dispatch = useDispatch();
  return useCallback(
    bindThunkAction(actionCreator, dispatch),
    [dispatch],
  );
};

type Params = {
  [key: string]: AsyncThunk<any, any, any>
};

type Result<P extends Params> = {
  [K in keyof P]: (args: GetThunkArg<P[K]>) => Promise<GetReturned<P[K]>>
};

export const useThunkActions = <P extends Params>(actionCreators: P): Result<P> => {
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
