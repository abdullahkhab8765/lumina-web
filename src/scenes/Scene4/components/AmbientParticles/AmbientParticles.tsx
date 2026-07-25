'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import styles from './AmbientParticles.module.css';
import { createAmbientParticleTween } from '../../animations/ambientAnimation';
import { createSeededPoints } from '../../utils/revealUtils';
import { AMBIENT_PARTICLE_COUNT } from '../../constants/scene4';

const AmbientParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particles = useMemo(() => createSeededPoints(AMBIENT_PARTICLE_COUNT, 9), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-letter-particle]'));
    const tweens = nodes.map((node, index) => {
      const p = particles[index];
      return createAmbientParticleTween(node, {
        riseDistance: 16 + (index % 5) * 4,
        duration: p?.duration ?? 10,
        delay: p?.delay ?? 0,
      });
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [particles]);

  return (
    <div ref={containerRef} className={styles.particleField} aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          data-letter-particle
          className={styles.particle}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.15 + (i % 4) * 0.05,
          }}
        />
      ))}
    </div>
  );
};

export default AmbientParticles;