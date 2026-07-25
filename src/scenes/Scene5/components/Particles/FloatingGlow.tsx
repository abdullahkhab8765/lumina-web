'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './Particles.module.css';
import { createSeededPoints } from '../../utils/particleMath';
import { FLOATING_GLOW_COUNT, FLOATING_GLOW_MIN_DURATION, FLOATING_GLOW_DURATION_RANGE } from '../../config/particlesConfig';
import { EASE_GENTLE } from '../../utils/easing';

const FloatingGlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const points = useMemo(() => createSeededPoints(FLOATING_GLOW_COUNT, 87), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-floating-glow]'));
    const tweens = nodes.map((node, i) => {
      const p = points[i];
      return gsap.to(node, {
        scale: 1.3,
        opacity: 0.18,
        duration: FLOATING_GLOW_MIN_DURATION + ((p?.duration ?? 0) % FLOATING_GLOW_DURATION_RANGE),
        delay: p?.delay ?? 0,
        ease: EASE_GENTLE,
        repeat: -1,
        yoyo: true,
      });
    });
    return () => tweens.forEach((t) => t.kill());
  }, [points]);

  return (
    <div ref={containerRef} className={styles.particleField} aria-hidden="true">
      {points.map((p, i) => (
        <span
          key={i}
          data-floating-glow
          className={styles.floatingGlow}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size * 14}px`, height: `${p.size * 14}px` }}
        />
      ))}
    </div>
  );
};

export default FloatingGlow;