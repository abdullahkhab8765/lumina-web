'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './FloatingParticles.module.css';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
}

const PARTICLE_COUNT = 22;

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = i / count;
    particles.push({
      id: i,
      left: (seed * 97) % 100,
      top: (seed * 61 + 13) % 100,
      size: 3 + ((i * 7) % 6),
      delay: (i * 0.37) % 6,
      duration: 9 + ((i * 3) % 7),
      drift: 12 + ((i * 5) % 18),
      opacity: 0.15 + ((i % 5) * 0.03),
    });
  }
  return particles;
}

const FloatingParticles: React.FC = () => {
  const particles = useMemo(() => createParticles(PARTICLE_COUNT), []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLDivElement>('[data-particle]')
    );

    const tweens: gsap.core.Tween[] = [];

    nodes.forEach((node, index) => {
      const p = particles[index];
      if (!p) return;

      gsap.set(node, { force3D: true });

      const tween = gsap.to(node, {
        y: `-=${p.drift + 20}`,
        x: `+=${(index % 2 === 0 ? 1 : -1) * (p.drift / 2)}`,
        opacity: p.opacity * 0.4,
        duration: p.duration,
        delay: p.delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      tweens.push(tween);
    });

    tweensRef.current = tweens;

    return () => {
      tweens.forEach((t) => t.kill());
      tweensRef.current = [];
    };
  }, [particles]);

  return (
    <div ref={containerRef} className={styles.particleField} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          data-particle
          className={styles.particle}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;