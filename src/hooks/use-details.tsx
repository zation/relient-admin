import { useCallback, useState } from 'react';

export interface UseDetails<Item = any> {
  detailsOnOpen?: (item: Item) => void
  detailsOnClose?: () => void
}

export default ({
  detailsOnOpen,
  detailsOnClose,
}: UseDetails = {}) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);
  const openDetails = useCallback((item) => {
    setDetailsVisible(true);
    setDetailsItem(item);
    if (detailsOnOpen) {
      detailsOnOpen(item);
    }
  }, [detailsOnOpen]);
  const closeDetails = useCallback(() => {
    setDetailsVisible(false);
    setDetailsItem(null);
    if (detailsOnClose) {
      detailsOnClose();
    }
  }, [detailsOnClose]);
  return {
    detailsVisible,
    detailsItem,
    openDetails,
    closeDetails,
  };
};
