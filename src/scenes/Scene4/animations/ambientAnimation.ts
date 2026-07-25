import gsap from 'gsap';
import { EASE_GENTLE } from '../utils/easing';

interface AmbientParticleOptions {
  riseDistance: number;
  duration: number;
  delay: number;
}

export function createAmbientParticleTween(
  node: HTMLElement,
  options: AmbientParticleOptions
): gsap.core.Tween {
  gsap.set(node, { force3D: true });

  return gsap.to(node, {
    y: `-=${options.riseDistance}`,
    opacity: 0.08,
    duration: options.duration,
    delay: options.delay,
    ease: EASE_GENTLE,
    repeat: -1,
    yoyo: true,
  });
}

interface LightRaySweepOptions {
  duration: number;
  delay: number;
}

export function createLightRaySweepTween(
  node: HTMLElement,
  options: LightRaySweepOptions
): gsap.core.Tween {
  gsap.set(node, { force3D: true });

  return gsap.to(node, {
    opacity: 0.5,
    xPercent: 6,
    duration: options.duration,
    delay: options.delay,
    ease: EASE_GENTLE,
    repeat: -1,
    yoyo: true,
  });
}