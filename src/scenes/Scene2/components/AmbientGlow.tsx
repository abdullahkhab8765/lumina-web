'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './AmbientGlow.module.css';

interface AmbientGlowProps {
  intensity?: number;
}

const AmbientGlow: React.FC<AmbientGlowProps> = ({ intensity = 0.6 }) => {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    gsap.set(el, { autoAlpha: 0, force3D: true });

    const tween = gsap.to(el, {
      autoAlpha: intensity,
      duration: 3.2,
      ease: 'power1.inOut',
      delay: 0.6,
    });

    tweenRef.current = tween;

    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, [intensity]);

  return (
    <div ref={glowRef} className={styles.glowRoot} aria-hidden="true">
      <div className={styles.glowCenter} />
      <div className={styles.glowEdge} />
    </div>
  );
};

export default AmbientGlow;