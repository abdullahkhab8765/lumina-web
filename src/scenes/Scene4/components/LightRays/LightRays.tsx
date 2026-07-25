'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import styles from './LightRays.module.css';
import { createLightRaySweepTween } from '../../animations/ambientAnimation';
import { createSeededPoints } from '../../utils/revealUtils';
import { LIGHT_RAY_COUNT, LIGHT_RAY_DURATION } from '../../constants/scene4';

const LightRays: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rays = useMemo(() => createSeededPoints(LIGHT_RAY_COUNT, 5), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll<HTMLDivElement>('[data-light-ray]'));
    const tweens = nodes.map((node, index) => {
      const ray = rays[index];
      return createLightRaySweepTween(node, {
        duration: LIGHT_RAY_DURATION + (ray?.duration ?? 0) * 0.4,
        delay: ray?.delay ?? 0,
      });
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [rays]);

  return (
    <div ref={containerRef} className={styles.raysRoot} aria-hidden="true">
      {rays.map((ray, i) => (
        <div
          key={i}
          data-light-ray
          className={styles.ray}
          style={{
            left: `${ray.left}%`,
            opacity: 0.12 + (i % 3) * 0.04,
          }}
        />
      ))}
    </div>
  );
};

export default LightRays;