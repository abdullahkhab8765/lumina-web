import gsap from 'gsap';
import { PAPER_ENTRANCE_DURATION, PAPER_BREATH_DURATION, PAPER_BREATH_SCALE } from '../constants/scene4';
import { EASE_SOFT_OUT, EASE_GENTLE } from '../utils/easing';

export function createPaperEntranceTimeline(paper: HTMLElement | null): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!paper) return tl;

  tl.set(paper, { autoAlpha: 0, y: 36, scale: 0.96 });
  tl.to(paper, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: PAPER_ENTRANCE_DURATION,
    ease: EASE_SOFT_OUT,
  });

  return tl;
}

export function createPaperBreathingTween(paper: HTMLElement | null): gsap.core.Tween | null {
  if (!paper) return null;

  return gsap.to(paper, {
    scale: PAPER_BREATH_SCALE,
    duration: PAPER_BREATH_DURATION,
    ease: EASE_GENTLE,
    repeat: -1,
    yoyo: true,
  });
}