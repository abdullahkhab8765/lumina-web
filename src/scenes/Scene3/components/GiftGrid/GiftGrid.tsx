'use client';

import React, { useCallback, useRef } from 'react';
import GiftBox from '../GiftBox/GiftBox';
import styles from './GiftGrid.module.css';
import { gifts } from '../../data/gifts';
import type { GiftStatus } from '../../types/scene3';

interface GiftGridProps {
  statuses: GiftStatus[];
  openingIndex: number | null;
  onOpen: (index: number) => void;
  onOpenAnimationComplete: (index: number) => void;
}

const GiftGrid: React.FC<GiftGridProps> = ({
  statuses,
  openingIndex,
  onOpen,
  onOpenAnimationComplete,
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = useCallback((index: number) => onOpen(index), [onOpen]);
  const handleComplete = useCallback(
    (index: number) => onOpenAnimationComplete(index),
    [onOpenAnimationComplete]
  );

  return (
    <div ref={gridRef} className={styles.grid} data-gift-grid>
      {gifts.map((gift, index) => (
        <GiftBox
          key={gift.id}
          index={index}
          status={statuses[index]}
          isOpening={openingIndex === index}
          onOpen={handleOpen}
          onOpenAnimationComplete={handleComplete}
        />
      ))}
    </div>
  );
};

export default GiftGrid;