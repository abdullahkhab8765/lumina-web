import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';

interface UseKenBurnsOptions {
  scaleFrom?: number;
  scaleTo?: number;
  xPercent?: number;
  yPercent?: number;
  duration?: number;
  transformOrigin?: string;
}

function useKenBurns<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: UseKenBurnsOptions = {}
): void {
  const {
    scaleFrom = 1.05,
    scaleTo = 1.16,
    xPercent = -2.5,
    yPercent = -1.5,
    duration = 26,
    transformOrigin = '50% 45%',
  } = options;

  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    gsap.set(el, {
      scale: scaleFrom,
      xPercent: 0,
      yPercent: 0,
      transformOrigin,
      force3D: true,
    });

    const tween = gsap.to(el, {
      scale: scaleTo,
      xPercent,
      yPercent,
      duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    tweenRef.current = tween;

    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, [targetRef, scaleFrom, scaleTo, xPercent, yPercent, duration, transformOrigin]);
}

export default useKenBurns;