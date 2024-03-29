import { useCallback, useState } from 'react';

export interface UseDetails<Item> {
  detailsOnOpen?: (item: Item) => void
  detailsOnClose?: () => void
}

export default function useDetails<Item>({
  detailsOnOpen,
  detailsOnClose,
}: UseDetails<Item> = {}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<Item | null>(null);
  const openDetails = useCallback((item: Item) => {
    setDetailsOpen(true);
    setDetailsItem(item);
    if (detailsOnOpen) {
      detailsOnOpen(item);
    }
  }, [detailsOnOpen]);
  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setDetailsItem(null);
    if (detailsOnClose) {
      detailsOnClose();
    }
  }, [detailsOnClose]);
  return {
    detailsOpen,
    detailsItem,
    openDetails,
    closeDetails,
  };
}
