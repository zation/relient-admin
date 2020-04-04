import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export default (action, deps = []) => {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(action, dispatch),
    [dispatch, ...deps],
  );
};
