'use client';

import React, { useRef } from 'react';
import LuxuryBackground from './components/LuxuryBackground/LuxuryBackground';
import GiftGrid from './components/GiftGrid/GiftGrid';
import MessageCard from './components/MessageCard/MessageCard';
import ProgressIndicator from './components/ProgressIndicator/ProgressIndicator';
import ContinueSection from './components/ContinueSection/ContinueSection';
import useGiftProgress from './hooks/useGiftProgress';
import useScene3 from './hooks/useScene3';
import useScene3Audio from './audio/useScene3Audio';
import { gifts } from './data/gifts';
import styles from './Scene3.module.css';

interface Scene3Props {
  isActive: boolean;
  onComplete: () => void;
}

const Scene3: React.FC<Scene3Props> = ({ isActive, onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const {
    statuses,
    openingIndex,
    revealedIndex,
    allCompleted,
    openGift,
    handleBoxAnimationComplete,
    closeMessage,
  } = useGiftProgress();

  useScene3(isActive, {
    container: containerRef,
    background: backgroundRef,
    grid: gridRef,
  });

  useScene3Audio(isActive);

  if (!isActive) return null;

  return (
    <div ref={containerRef} className={styles.sceneRoot}>
      <div ref={backgroundRef} className={styles.backgroundLayer}>
        <LuxuryBackground />
      </div>

      <div className={styles.progressLayer}>
        <ProgressIndicator statuses={statuses} />
      </div>

      <div ref={gridRef} className={styles.gridLayer}>
        <GiftGrid
          statuses={statuses}
          openingIndex={openingIndex}
          onOpen={openGift}
          onOpenAnimationComplete={handleBoxAnimationComplete}
        />
      </div>

      {revealedIndex !== null && (
        <MessageCard
          gift={gifts[revealedIndex]}
          giftIndex={revealedIndex}
          onClose={closeMessage}
        />
      )}

      {allCompleted && <ContinueSection onContinue={onComplete} />}
    </div>
  );
};

export default Scene3;