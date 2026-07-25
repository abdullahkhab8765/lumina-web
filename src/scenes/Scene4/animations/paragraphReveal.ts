import gsap from 'gsap';
import { PARAGRAPH_REVEAL_DURATION, PARAGRAPH_EXIT_DURATION, PARAGRAPH_WORD_STAGGER } from '../constants/scene4';
import { EASE_REVEAL, EASE_SOFT_IN_OUT } from '../utils/easing';

interface ParagraphRevealOptions {
  delay?: number;
  onComplete?: () => void;
}

export function createParagraphRevealTimeline(
  words: HTMLElement[],
  options: ParagraphRevealOptions = {}
): gsap.core.Timeline {
  const { delay = 0, onComplete } = options;
  const tl = gsap.timeline({ delay, onComplete });
  if (!words.length) return tl;

  tl.set(words, { autoAlpha: 0, y: 14, filter: 'blur(6px)' });
  tl.to(words, {
    autoAlpha: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: PARAGRAPH_REVEAL_DURATION,
    stagger: PARAGRAPH_WORD_STAGGER,
    ease: EASE_REVEAL,
  });

  return tl;
}

export function createParagraphExitTimeline(
  container: HTMLElement | null,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete });
  if (!container) return tl;

  tl.to(container, {
    autoAlpha: 0,
    y: -12,
    filter: 'blur(4px)',
    duration: PARAGRAPH_EXIT_DURATION,
    ease: EASE_SOFT_IN_OUT,
  });

  return tl;
}