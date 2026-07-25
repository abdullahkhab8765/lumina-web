import gsap from 'gsap';
import { MESSAGE_CARD_ENTER_DURATION, MESSAGE_CARD_EXIT_DURATION } from '../constants/scene3';

export function createMessageCardEnterTimeline(el: HTMLElement | null): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!el) return tl;

  tl.fromTo(
    el,
    { autoAlpha: 0, y: 32, scale: 0.97 },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: MESSAGE_CARD_ENTER_DURATION,
      ease: 'power3.out',
    }
  );

  return tl;
}

export function createMessageCardExitTimeline(
  el: HTMLElement | null,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete });
  if (!el) {
    onComplete?.();
    return tl;
  }

  tl.to(el, {
    autoAlpha: 0,
    y: -20,
    scale: 0.97,
    duration: MESSAGE_CARD_EXIT_DURATION,
    ease: 'power2.in',
  });

  return tl;
}