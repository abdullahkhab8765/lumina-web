'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './ContinueSection.module.css';
import { CONTINUE_SECTION_DELAY, CONTINUE_SECTION_ENTER_DURATION } from '../../constants/scene3';

interface ContinueSectionProps {
  onContinue: () => void;
}

const ContinueSection: React.FC<ContinueSectionProps> = ({ onContinue }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: CONTINUE_SECTION_ENTER_DURATION,
        delay: CONTINUE_SECTION_DELAY,
        ease: 'power2.out',
      }
    );

    tweenRef.current = tween;

    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.wrapper}>
      <button type="button" className={styles.continueButton} onClick={onContinue}>
        Continue
      </button>
    </div>
  );
};

export default ContinueSection;