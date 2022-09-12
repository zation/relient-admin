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
  open?: boolean
}

export default ({ dirty, submitSucceeded, checkEditing, open }: Params) => useEffect(() => {
  window.isFormEditing = !!checkEditing && dirty && !submitSucceeded && !!open;
  return () => {
    window.isFormEditing = false;
  };
}, [dirty, submitSucceeded, checkEditing, open]);
