'use client';

import { useCallback, type RefObject } from 'react';
import gsap from 'gsap';
import { EASE_SOFT_IN_OUT } from '../utils/easing';

export interface ParticlesHandle {
  fadeIn: (duration: number) => gsap.core.Tween | null;
}

function useParticles(containerRef: RefObject<HTMLDivElement | null>): ParticlesHandle {
  const fadeIn = useCallback(
    (duration: number): gsap.core.Tween | null => {
      const el = containerRef.current;
      if (!el) return null;
      gsap.set(el, { opacity: 0 });
      return gsap.to(el, { opacity: 1, duration, ease: EASE_SOFT_IN_OUT, paused: true });
    },
    [containerRef]
  );

  return { fadeIn };
}

export default useParticles;