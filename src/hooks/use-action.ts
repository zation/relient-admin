import { ActionCreator, bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export default <A, C extends ActionCreator<A>>(action: C, deps = []) => {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(action, dispatch),
    [dispatch, ...deps],
  );
};
