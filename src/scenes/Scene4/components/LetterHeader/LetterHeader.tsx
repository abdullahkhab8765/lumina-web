'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LetterHeader.module.css';
import { HEADER_REVEAL_DURATION, HEADER_REVEAL_DELAY } from '../../constants/scene4';
import { EASE_SOFT_OUT } from '../../utils/easing';

interface LetterHeaderProps {
  heading: string;
}

const LetterHeader: React.FC<LetterHeaderProps> = ({ heading }) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: HEADER_REVEAL_DURATION,
        delay: HEADER_REVEAL_DELAY,
        ease: EASE_SOFT_OUT,
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <h1 ref={headingRef} className={styles.heading}>
      {heading}
    </h1>
  );
};

export default LetterHeader;