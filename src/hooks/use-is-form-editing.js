import { useEffect } from 'react';

export default ({ dirty, submitSucceeded, checkEditing, visible }) => useEffect(() => {
  global.isFormEditing = checkEditing && dirty && !submitSucceeded && visible;
  return () => {
    global.isFormEditing = false;
  };
}, [dirty, submitSucceeded, checkEditing, visible]);
