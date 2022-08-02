import { useEffect } from 'react';

declare global {
  interface Window {
    isFormEditing: boolean
  }
}

interface Params {
  dirty: boolean
  submitSucceeded: boolean
  checkEditing?: boolean
  visible?: boolean
}

export default ({ dirty, submitSucceeded, checkEditing, visible }: Params) => useEffect(() => {
  window.isFormEditing = !!checkEditing && dirty && !submitSucceeded && !!visible;
  return () => {
    window.isFormEditing = false;
  };
}, [dirty, submitSucceeded, checkEditing, visible]);
