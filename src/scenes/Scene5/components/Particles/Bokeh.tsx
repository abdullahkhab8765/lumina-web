'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './Particles.module.css';
import { createSeededPoints } from '../../utils/particleMath';
import { BOKEH_COUNT, BOKEH_MIN_DURATION, BOKEH_DURATION_RANGE } from '../../config/particlesConfig';
import { EASE_DRIFT } from '../../utils/easing';

const Bokeh: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const points = useMemo(() => createSeededPoints(BOKEH_COUNT, 63), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-bokeh]'));
    const tweens = nodes.map((node, i) => {
      const p = points[i];
      return gsap.to(node, {
        x: `+=${(i % 2 === 0 ? 1 : -1) * (30 + (i % 3) * 10)}`,
        y: `-=${20 + (i % 4) * 8}`,
        duration: BOKEH_MIN_DURATION + ((p?.duration ?? 0) % BOKEH_DURATION_RANGE),
        delay: p?.delay ?? 0,
        ease: EASE_DRIFT,
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
          data-bokeh
          className={styles.bokeh}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size * 6}px`, height: `${p.size * 6}px` }}
        />
      ))}
    </div>
  );
};

export default Bokeh;