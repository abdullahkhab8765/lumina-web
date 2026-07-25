'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './Background.module.css';
import { createSeededPoints, bucketPoints } from '../../utils/particleMath';
import { EASE_GENTLE } from '../../utils/easing';

const STAR_COUNT = 90;
const STAR_BUCKET_COUNT = 5;

const Stars: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stars = useMemo(() => createSeededPoints(STAR_COUNT, 3), []);
  const buckets = useMemo(() => bucketPoints(stars, STAR_BUCKET_COUNT), [stars]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const allNodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-star]'));
    const tweens: gsap.core.Tween[] = [];

    let cursor = 0;
    buckets.forEach((bucket, bucketIndex) => {
      const bucketNodes = allNodes.slice(cursor, cursor + bucket.length);
      cursor += bucket.length;
      if (!bucketNodes.length) return;

      const avgDuration = bucket.reduce((sum, p) => sum + p.duration, 0) / bucket.length;

      tweens.push(
        gsap.to(bucketNodes, {
          opacity: 0.2,
          duration: avgDuration * 0.6,
          ease: EASE_GENTLE,
          repeat: -1,
          yoyo: true,
          stagger: 0.12,
          delay: bucketIndex * 0.3,
        })
      );
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [buckets]);

  return (
    <div ref={containerRef} className={styles.starsField} aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          data-star
          className={styles.star}
          style={{
            left: `${star.left}%`,
            top: `${star.top % 60}%`,
            width: `${star.size * 0.6}px`,
            height: `${star.size * 0.6}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Stars;