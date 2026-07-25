'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Background.module.css';
import { EASE_DRIFT } from '../../utils/easing';

const CLOUD_COUNT = 4;

const Clouds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll<HTMLDivElement>('[data-cloud]'));
    const tweens = nodes.map((node, i) =>
      gsap.to(node, {
        xPercent: i % 2 === 0 ? 6 : -6,
        duration: 46 + i * 9,
        ease: EASE_DRIFT,
        repeat: -1,
        yoyo: true,
      })
    );

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.cloudsField} aria-hidden="true">
      {Array.from({ length: CLOUD_COUNT }).map((_, i) => (
        <div
          key={i}
          data-cloud
          className={styles.cloud}
          style={{
            left: `${10 + i * 22}%`,
            top: `${8 + (i % 2) * 14}%`,
            width: `${34 + (i % 3) * 10}vw`,
          }}
        />
      ))}
    </div>
  );
};

export default Clouds;