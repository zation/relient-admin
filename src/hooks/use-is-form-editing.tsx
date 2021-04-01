import { useEffect } from 'react';

declare global {
  namespace NodeJS {
    interface Global {
      isFormEditing: boolean
    }
  }
}

interface Params {
  dirty: boolean
  submitSucceeded: boolean
  checkEditing?: boolean
  visible?: boolean
}

export default ({ dirty, submitSucceeded, checkEditing, visible }: Params) => useEffect(() => {
  global.isFormEditing = !!checkEditing && dirty && !submitSucceeded && !!visible;
  return () => {
    global.isFormEditing = false;
  };
}, [dirty, submitSucceeded, checkEditing, visible]);
