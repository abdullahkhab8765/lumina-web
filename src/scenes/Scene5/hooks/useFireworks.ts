'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { FireworkLauncher, acquireLauncher, releaseLauncher } from '../components/Fireworks/FireworkLauncher';
import { FireworkBurst } from '../components/Fireworks/FireworkBurst';
import { FireworkSmoke } from '../components/Fireworks/FireworkSmoke';
import { FIREWORK_SEQUENCE, FIREWORK_COLORS } from '../config/fireworksConfig';
import { EASE_FLASH_IN, EASE_FLASH_OUT } from '../utils/easing';
import type { FireworkLaunchEvent } from '../types/fireworks';

export interface FireworksHandle {
  buildSequenceTimeline: () => gsap.core.Timeline;
  stop: () => void;
}

interface UseFireworksOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  lightingRef?: RefObject<HTMLDivElement | null>;
}

function useFireworks({ canvasRef, lightingRef }: UseFireworksOptions): FireworksHandle {
  const rocketsRef = useRef<FireworkLauncher[]>([]);
  const burstsRef = useRef<FireworkBurst[]>([]);
  const smokeRef = useRef(new FireworkSmoke());
  const sizeRef = useRef({ width: 0, height: 0 });
  const rafRef = useRef(0);
  const runningRef = useRef(true);
  const flashTweenRef = useRef<gsap.core.Timeline | null>(null);

  const flash = useCallback(
    (intensity: number) => {
      const el = lightingRef?.current;
      if (!el) return;
      flashTweenRef.current?.kill();
      flashTweenRef.current = gsap
        .timeline()
        .fromTo(el, { opacity: 0 }, { opacity: intensity, duration: 0.1, ease: EASE_FLASH_IN })
        .to(el, { opacity: 0, duration: 0.5, ease: EASE_FLASH_OUT });
    },
    [lightingRef]
  );

  const explode = useCallback(
    (rocket: FireworkLauncher) => {
      const burst = new FireworkBurst(rocket.x, rocket.y, rocket.shape, rocket.color, rocket.scale);
      burstsRef.current.push(burst);
      smokeRef.current.spawn(rocket.x, rocket.y, rocket.shape === 'palm' ? 5 : 3);
      flash(Math.min(0.45 * rocket.scale, 0.65));
    },
    [flash]
  );

  const launch = useCallback((event: FireworkLaunchEvent) => {
    const { width, height } = sizeRef.current;
    const color = FIREWORK_COLORS[event.color] ?? FIREWORK_COLORS.gold;
    const x = width * (event.originXPercent / 100);
    const targetY = height * (event.apexYPercent / 100);
    rocketsRef.current.push(acquireLauncher(x, height + 10, targetY, color, event.shape, event.scale));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height };
    };
    resize();
    window.addEventListener('resize', resize);

    runningRef.current = true;

    const animate = () => {
      if (!runningRef.current) return;
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i];
        rocket.update();
        rocket.draw(ctx);
        if (rocket.done) {
          explode(rocket);
          releaseLauncher(rocket);
          const last = rockets.pop();
          if (last && i < rockets.length) rockets[i] = last;
        }
      }

      smokeRef.current.update();
      smokeRef.current.draw(ctx);

      const bursts = burstsRef.current;
      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const burst = bursts[i];
        burst.update();
        burst.draw(ctx);
        if (!burst.alive) {
          const last = bursts.pop();
          if (last && i < bursts.length) bursts[i] = last;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      flashTweenRef.current?.kill();
      flashTweenRef.current = null;
      rocketsRef.current.forEach(releaseLauncher);
      rocketsRef.current = [];
      burstsRef.current = [];
    };
  }, [canvasRef, explode]);

  const buildSequenceTimeline = useCallback((): gsap.core.Timeline => {
    const tl = gsap.timeline();
    FIREWORK_SEQUENCE.forEach((event) => {
      tl.call(() => launch(event), undefined, event.delay);
    });
    return tl;
  }, [launch]);

  const stop = useCallback(() => {
    runningRef.current = false;
    rocketsRef.current.forEach(releaseLauncher);
    rocketsRef.current = [];
    burstsRef.current = [];
  }, []);

  return { buildSequenceTimeline, stop };
}

export default useFireworks;