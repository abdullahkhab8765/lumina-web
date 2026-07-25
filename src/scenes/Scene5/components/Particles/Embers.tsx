'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './Particles.module.css';
import { createSeededPoints } from '../../utils/particleMath';
import { EMBERS_COUNT, EMBERS_MIN_DURATION, EMBERS_DURATION_RANGE, EMBERS_RISE_DISTANCE } from '../../config/particlesConfig';
import { EASE_GENTLE } from '../../utils/easing';

const Embers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const points = useMemo(() => createSeededPoints(EMBERS_COUNT, 41), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-ember]'));
    const tweens = nodes.map((node, i) => {
      const p = points[i];
      const segmentDuration = EMBERS_MIN_DURATION + ((p?.duration ?? 0) % EMBERS_DURATION_RANGE);
      const tl = gsap.timeline({ repeat: -1, delay: p?.delay ?? 0 });
      tl.fromTo(
        node,
        { y: 0, opacity: 0 },
        { y: -EMBERS_RISE_DISTANCE - (i % 4) * 12, opacity: 0.75, duration: segmentDuration * 0.4, ease: EASE_GENTLE }
      ).to(node, { opacity: 0, duration: segmentDuration * 0.6, ease: EASE_GENTLE });
      return tl;
    });
    return () => tweens.forEach((t) => t.kill());
  }, [points]);

  return (
    <div ref={containerRef} className={styles.particleField} aria-hidden="true">
      {points.map((p, i) => (
        <span
          key={i}
          data-ember
          className={styles.ember}
          style={{ left: `${p.left}%`, top: `${60 + (p.top % 35)}%`, width: `${p.size * 0.7}px`, height: `${p.size * 0.7}px` }}
        />
      ))}
    </div>
  );
};

export default Embers;