import gsap from 'gsap';
import { SCENE4_FADE_IN_DURATION } from '../constants/scene4';
import { EASE_SOFT_IN_OUT, EASE_LONG_FADE } from '../utils/easing';

interface Scene4Targets {
  container: HTMLElement | null;
  overlay: HTMLElement | null;
}

interface Scene4TimelineOptions {
  fadeInDuration: number;
}

export function createScene4EntranceTimeline(
  targets: Scene4Targets,
  options: Scene4TimelineOptions
): gsap.core.Timeline {
  const { container, overlay } = targets;
  const { fadeInDuration } = options;

  const tl = gsap.timeline({ defaults: { ease: EASE_SOFT_IN_OUT } });

  if (container) {
    tl.set(container, { autoAlpha: 0 });
    tl.to(container, { autoAlpha: 1, duration: fadeInDuration }, 0);
  }

  if (overlay) {
    tl.set(overlay, { autoAlpha: 0 }, 0);
    tl.to(overlay, { autoAlpha: 1, duration: fadeInDuration * 1.3, ease: EASE_LONG_FADE }, 0);
  }

  return tl;
}