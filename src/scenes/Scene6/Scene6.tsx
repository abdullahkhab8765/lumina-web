'use client';

import React, { useRef } from 'react';
import Backdrop from './components/Backdrop/Backdrop';
import StarDust from './components/StarDust/StarDust';
import CreditsRoll, { type CreditsRollHandle } from './components/CreditsRoll/CreditsRoll';
import ClosingMessage from './components/ClosingMessage/ClosingMessage';
import ReplayButton from './components/ReplayButton/ReplayButton';
import useScene6Timeline from './hooks/useScene6Timeline';
import styles from './Scene6.module.css';

interface Scene6Props {
  isActive: boolean;
  onComplete: () => void;
}

/**
 * Scene 6 is the terminal scene: rolling credits followed by a closing
 * message. Unlike Scenes 1-5, `onComplete` is NOT called automatically
 * when the sequence finishes -- it's wired to the "Watch Again" button,
 * so the experience waits for Aima rather than looping or dead-ending.
 */
const Scene6: React.FC<Scene6Props> = ({ isActive, onComplete }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const creditsRef = useRef<CreditsRollHandle | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);
  const replayButtonRef = useRef<HTMLButtonElement | null>(null);

  useScene6Timeline(isActive, {
    root: rootRef,
    credits: creditsRef,
    closing: closingRef,
    replayButton: replayButtonRef,
  });

  if (!isActive) return null;

  return (
    <div ref={rootRef} className={styles.sceneRoot}>
      <Backdrop />
      <StarDust />
      <CreditsRoll ref={creditsRef} />
      <ClosingMessage ref={closingRef} />
      <ReplayButton ref={replayButtonRef} onReplay={onComplete} />
    </div>
  );
};

export default Scene6;