import gsap from 'gsap';
import { ENDING_GLOW_DURATION, AMBIENT_GLOW_DURATION } from '../constants/scene4';
import { EASE_SOFT_OUT, EASE_GENTLE } from '../utils/easing';

export function createEndingGlowTimeline(glow: HTMLElement | null): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!glow) return tl;

  tl.set(glow, { autoAlpha: 0, scale: 0.85 })
    .to(glow, {
      autoAlpha: 1,
      scale: 1,
      duration: ENDING_GLOW_DURATION,
      ease: EASE_SOFT_OUT,
    })
    .to(glow, {
      scale: 1.08,
      duration: AMBIENT_GLOW_DURATION,
      ease: EASE_GENTLE,
      repeat: -1,
      yoyo: true,
    });

  return tl;
}