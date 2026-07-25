import gsap from 'gsap';
import type { GiftBoxRefs } from '../types/scene3';
import {
  GIFT_OPEN_LID_ROTATION,
  GIFT_OPEN_LID_DURATION,
  GIFT_OPEN_RIBBON_DURATION,
  GIFT_OPEN_GLOW_DURATION,
  GIFT_OPEN_DISSOLVE_DURATION,
} from '../constants/scene3';

interface GiftOpenTimelineCallbacks {
  onRevealComplete?: () => void;
}

export function createGiftOpenTimeline(
  refs: GiftBoxRefs,
  callbacks: GiftOpenTimelineCallbacks = {}
): gsap.core.Timeline {
  const { box, lid, ribbon, glow, particles } = refs;
  const { onRevealComplete } = callbacks;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  if (box) {
    tl.to(box, { y: -14, duration: 0.3, ease: 'power2.out' });
  }

  if (ribbon) {
    tl.to(
      ribbon,
      { scaleY: 0, autoAlpha: 0, duration: GIFT_OPEN_RIBBON_DURATION, ease: 'power1.in' },
      '<'
    );
  }

  if (lid) {
    tl.to(
      lid,
      {
        rotateX: GIFT_OPEN_LID_ROTATION,
        y: -18,
        duration: GIFT_OPEN_LID_DURATION,
        ease: 'power3.out',
      },
      '-=0.1'
    );
  }

  if (glow) {
    tl.set(glow, { autoAlpha: 0, scale: 0.6 }, '-=0.5');
    tl.to(
      glow,
      { autoAlpha: 1, scale: 1.6, duration: GIFT_OPEN_GLOW_DURATION, ease: 'power2.out' },
      '-=0.45'
    );
  }

  if (particles) {
    const nodes = particles.querySelectorAll<HTMLElement>('[data-gift-particle]');
    if (nodes.length) {
      tl.set(nodes, { autoAlpha: 0, y: 0, scale: 0.5 }, '-=0.6');
      tl.to(
        nodes,
        {
          autoAlpha: 1,
          y: -60,
          scale: 1,
          duration: 0.9,
          stagger: 0.02,
          ease: 'power1.out',
        },
        '-=0.5'
      );
      tl.to(nodes, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, '-=0.2');
    }
  }

  if (box) {
    tl.to(
      box,
      {
        autoAlpha: 0,
        scale: 0.85,
        duration: GIFT_OPEN_DISSOLVE_DURATION,
        ease: 'power2.in',
      },
      '-=0.3'
    );
  }

  if (onRevealComplete) {
    tl.call(onRevealComplete);
  }

  return tl;
}

interface GiftUnlockTimelineOptions {
  duration: number;
}

export function createGiftUnlockTimeline(
  el: HTMLElement | null,
  options: GiftUnlockTimelineOptions
): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!el) return tl;

  tl.fromTo(
    el,
    { autoAlpha: 0, y: 20, scale: 0.9 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
  );

  tl.to(el, {
    boxShadow: '0 0 38px rgba(255, 200, 120, 0.55)',
    duration: options.duration / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1,
  });

  return tl;
}