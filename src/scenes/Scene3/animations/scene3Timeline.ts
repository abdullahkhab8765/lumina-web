import gsap from 'gsap';
import { GIFT_GRID_STAGGER, GIFT_ENTRANCE_DURATION } from '../constants/scene3';

interface Scene3Targets {
  container: HTMLElement | null;
  background: HTMLElement | null;
  grid: HTMLElement | null;
}

interface Scene3TimelineOptions {
  fadeInDuration: number;
}

export function createScene3EntranceTimeline(
  targets: Scene3Targets,
  options: Scene3TimelineOptions
): gsap.core.Timeline {
  const { container, background, grid } = targets;
  const { fadeInDuration } = options;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  if (container) {
    tl.set(container, { autoAlpha: 0 });
    tl.to(container, { autoAlpha: 1, duration: fadeInDuration, ease: 'power1.inOut' });
  }

  if (background) {
    tl.set(background, { autoAlpha: 0 }, 0);
    tl.to(
      background,
      { autoAlpha: 1, duration: fadeInDuration * 1.2, ease: 'power1.inOut' },
      0
    );
  }

  if (grid) {
    const items = grid.querySelectorAll<HTMLElement>('[data-gift-item]');
    if (items.length) {
      tl.set(items, { autoAlpha: 0, y: 28, scale: 0.94 }, 0.2);
      tl.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: GIFT_ENTRANCE_DURATION,
          stagger: GIFT_GRID_STAGGER,
          ease: 'back.out(1.6)',
        },
        0.4
      );
    }
  }

  return tl;
}