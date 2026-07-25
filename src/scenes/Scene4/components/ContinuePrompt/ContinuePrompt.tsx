'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './ContinuePrompt.module.css';
import { CONTINUE_PROMPT_DELAY, CONTINUE_PROMPT_ENTER_DURATION } from '../../constants/scene4';
import { EASE_REVEAL } from '../../utils/easing';

interface ContinuePromptProps {
  label?: string;
  onContinue: () => void;
}

const ContinuePrompt: React.FC<ContinuePromptProps> = ({ label = 'Continue', onContinue }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: CONTINUE_PROMPT_ENTER_DURATION,
        delay: CONTINUE_PROMPT_DELAY,
        ease: EASE_REVEAL,
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.wrapper}>
      <button type="button" className={styles.continueButton} onClick={onContinue}>
        {label}
      </button>
    </div>
  );
};

export default ContinuePrompt;