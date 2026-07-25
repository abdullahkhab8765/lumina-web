'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './Particles.module.css';
import { createSeededPoints, bucketPoints } from '../../utils/particleMath';
import { GOLDEN_DUST_COUNT, GOLDEN_DUST_MIN_DURATION, GOLDEN_DUST_DURATION_RANGE } from '../../config/particlesConfig';
import { EASE_GENTLE } from '../../utils/easing';

const GOLDEN_DUST_BUCKET_COUNT = 4;

const GoldenDust: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const points = useMemo(() => createSeededPoints(GOLDEN_DUST_COUNT, 21), []);
  const buckets = useMemo(() => bucketPoints(points, GOLDEN_DUST_BUCKET_COUNT), [points]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const allNodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-dust]'));
    const tweens: gsap.core.Tween[] = [];

    let cursor = 0;
    buckets.forEach((bucket, bucketIndex) => {
      const bucketNodes = allNodes.slice(cursor, cursor + bucket.length);
      cursor += bucket.length;
      if (!bucketNodes.length) return;

      const avgDuration =
        GOLDEN_DUST_MIN_DURATION +
        (bucket.reduce((sum, p) => sum + p.duration, 0) / bucket.length) % GOLDEN_DUST_DURATION_RANGE;

      tweens.push(
        gsap.to(bucketNodes, {
          y: `-=${28 + bucketIndex * 6}`,
          x: `+=${bucketIndex % 2 === 0 ? 10 : -10}`,
          opacity: 0.05,
          duration: avgDuration,
          ease: EASE_GENTLE,
          repeat: -1,
          yoyo: true,
          stagger: 0.25,
          delay: bucketIndex * 0.4,
        })
      );
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [buckets]);

  return (
    <div ref={containerRef} className={styles.particleField} aria-hidden="true">
      {points.map((p, i) => (
        <span
          key={i}
          data-dust
          className={styles.goldenDust}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px` }}
        />
      ))}
    </div>
  );
};

export default GoldenDust;