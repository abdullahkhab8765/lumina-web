'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './StarDust.module.css';
import { STAR_DUST_COUNT } from '../../config/scene6Config';

interface DustPoint {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

function createDustPoints(count: number): DustPoint[] {
  const points: DustPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = i / count;
    points.push({
      left: (seed * 97 + 11) % 100,
      top: (seed * 59 + 23) % 100,
      size: 1 + (i % 3),
      delay: (i * 0.4) % 8,
      duration: 9 + (i % 6),
    });
  }
  return points;
}

const StarDust: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const points = useMemo(() => createDustPoints(STAR_DUST_COUNT), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-dust]'));
    const tweens = nodes.map((node, i) => {
      const p = points[i];
      return gsap.to(node, {
        opacity: 0.15,
        duration: p?.duration ?? 10,
        delay: p?.delay ?? 0,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
    return () => tweens.forEach((t) => t.kill());
  }, [points]);

  return (
    <div ref={containerRef} className={styles.field} aria-hidden="true">
      {points.map((p, i) => (
        <span
          key={i}
          data-dust
          className={styles.dust}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px` }}
        />
      ))}
    </div>
  );
};

export default StarDust;