import { useCallback, useMemo, useState } from 'react';
import { GIFT_COUNT } from '../constants/scene3';
import type { GiftStatus } from '../types/scene3';

interface UseGiftProgressResult {
  statuses: GiftStatus[];
  openingIndex: number | null;
  revealedIndex: number | null;
  allCompleted: boolean;
  openGift: (index: number) => void;
  handleBoxAnimationComplete: (index: number) => void;
  closeMessage: () => void;
}

function buildInitialStatuses(): GiftStatus[] {
  return Array.from({ length: GIFT_COUNT }, (_, i) => (i === 0 ? 'active' : 'locked'));
}

function useGiftProgress(): UseGiftProgressResult {
  const [statuses, setStatuses] = useState<GiftStatus[]>(buildInitialStatuses);
  const [openingIndex, setOpeningIndex] = useState<number | null>(null);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  const allCompleted = useMemo(
    () => statuses.every((status) => status === 'opened'),
    [statuses]
  );

  const openGift = useCallback(
    (index: number) => {
      if (statuses[index] !== 'active') return;
      if (openingIndex !== null || revealedIndex !== null) return;
      setOpeningIndex(index);
    },
    [statuses, openingIndex, revealedIndex]
  );

  const handleBoxAnimationComplete = useCallback((index: number) => {
    setOpeningIndex(null);
    setRevealedIndex(index);
  }, []);

  const closeMessage = useCallback(() => {
    if (revealedIndex === null) return;

    setStatuses((prev) => {
      const next = [...prev];
      next[revealedIndex] = 'opened';
      const nextIndex = revealedIndex + 1;
      if (nextIndex < next.length) {
        next[nextIndex] = 'active';
      }
      return next;
    });

    setRevealedIndex(null);
  }, [revealedIndex]);

  return {
    statuses,
    openingIndex,
    revealedIndex,
    allCompleted,
    openGift,
    handleBoxAnimationComplete,
    closeMessage,
  };
}

export default useGiftProgress;