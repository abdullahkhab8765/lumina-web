'use client';

import React, { useEffect, useRef } from 'react';
import styles from './EndingGlow.module.css';
import { createEndingGlowTimeline } from '../../animations/endingAnimation';

interface EndingGlowProps {
  active: boolean;
}

const EndingGlow: React.FC<EndingGlowProps> = ({ active }) => {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const tl = createEndingGlowTimeline(glowRef.current);

    return () => {
      tl.kill();
    };
  }, [active]);

  if (!active) return null;

  return <div ref={glowRef} className={styles.glow} aria-hidden="true" />;
};

export default EndingGlow;