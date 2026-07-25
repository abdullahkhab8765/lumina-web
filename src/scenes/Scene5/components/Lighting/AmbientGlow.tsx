'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Lighting.module.css';
import { EASE_GENTLE } from '../../utils/easing';

const AmbientGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      opacity: 0.55,
      duration: 7,
      ease: EASE_GENTLE,
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return <div ref={glowRef} className={styles.ambientGlow} aria-hidden="true" />;
};

export default AmbientGlow;