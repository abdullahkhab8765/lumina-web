'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './LuxuryBackground.module.css';
import { createSeededPoints } from '../../utils/scene3Helpers';
import { BACKGROUND_PARTICLE_COUNT, BACKGROUND_GLOW_DURATION } from '../../constants/scene3';

const LuxuryBackground: React.FC = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const particleContainerRef = useRef<HTMLDivElement | null>(null);
  const glowTweenRef = useRef<gsap.core.Tween | null>(null);
  const particleTweensRef = useRef<gsap.core.Tween[]>([]);

  const particles = useMemo(() => createSeededPoints(BACKGROUND_PARTICLE_COUNT, 3), []);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 1, force3D: true });

    const tween = gsap.to(el, {
      xPercent: -46,
      yPercent: -54,
      scale: 1.25,
      duration: BACKGROUND_GLOW_DURATION,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    glowTweenRef.current = tween;

    return () => {
      tween.kill();
      glowTweenRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = particleContainerRef.current;
    if (!container) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLSpanElement>('[data-bg-particle]')
    );

    const tweens: gsap.core.Tween[] = [];

    nodes.forEach((node, index) => {
      const p = particles[index];
      if (!p) return;

      gsap.set(node, { force3D: true });

      const tween = gsap.to(node, {
        y: `-=${18 + (index % 6) * 5}`,
        opacity: 0.05,
        duration: p.duration,
        delay: p.delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      tweens.push(tween);
    });

    particleTweensRef.current = tweens;

    return () => {
      tweens.forEach((t) => t.kill());
      particleTweensRef.current = [];
    };
  }, [particles]);

  return (
    <div className={styles.backgroundRoot} aria-hidden="true">
      <div className={styles.baseGradient} />
      <div ref={glowRef} className={styles.centerGlow} />
      <div className={styles.vignette} />
      <div ref={particleContainerRef} className={styles.particleField}>
        {particles.map((p, i) => (
          <span
            key={i}
            data-bg-particle
            className={styles.particle}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.2 + (i % 4) * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LuxuryBackground;