import gsap from 'gsap';
import type { RefObject } from 'react';
import {
  SCENE6_FADE_IN_DURATION,
  CREDITS_SCROLL_DURATION,
  CREDITS_HOLD_BEFORE_SCROLL,
  CLOSING_REVEAL_DURATION,
  CLOSING_HOLD_DURATION,
  REPLAY_BUTTON_DELAY,
  REPLAY_BUTTON_DURATION,
} from '../config/scene6Config';
import type { CreditsRollHandle } from '../components/CreditsRoll/CreditsRoll';

export interface Scene6TimelineRefs {
  root: RefObject<HTMLDivElement | null>;
  credits: RefObject<CreditsRollHandle | null>;
  closing: RefObject<HTMLDivElement | null>;
  replayButton: RefObject<HTMLButtonElement | null>;
}

export function createScene6Timeline(refs: Scene6TimelineRefs): gsap.core.Timeline {
  const root = refs.root.current;
  const creditsHandle = refs.credits.current;
  const closing = refs.closing.current;
  const replayButton = refs.replayButton.current;

  const master = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

  if (root) {
    master.set(root, { autoAlpha: 0 }, 'sceneStart');
    master.to(root, { autoAlpha: 1, duration: SCENE6_FADE_IN_DURATION }, 'sceneStart');
  }

  master.addLabel('creditsStart', `sceneStart+=${CREDITS_HOLD_BEFORE_SCROLL}`);

  if (creditsHandle?.column && creditsHandle?.viewport) {
    const column = creditsHandle.column;
    const viewport = creditsHandle.viewport;
    const columnHeight = column.getBoundingClientRect().height;
    const viewportHeight = viewport.getBoundingClientRect().height;
    const scrollDistance = columnHeight + viewportHeight;

    master.to(column, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 'creditsStart');
    master.to(column, { y: -scrollDistance, duration: CREDITS_SCROLL_DURATION, ease: 'none' }, 'creditsStart');

    master.addLabel('closingStart', `creditsStart+=${CREDITS_SCROLL_DURATION - 2}`);
  } else {
    master.addLabel('closingStart', 'creditsStart+=2');
  }

  if (closing) {
    master.fromTo(
      closing,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: CLOSING_REVEAL_DURATION, ease: 'power3.out' },
      'closingStart'
    );
  }

  master.addLabel('replayReveal', `closingStart+=${CLOSING_REVEAL_DURATION + CLOSING_HOLD_DURATION}`);

  if (replayButton) {
    master.set(replayButton, { pointerEvents: 'none' }, 'sceneStart');
    master.fromTo(
      replayButton,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: REPLAY_BUTTON_DURATION,
        delay: REPLAY_BUTTON_DELAY,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(replayButton, { pointerEvents: 'auto' });
        },
      },
      'replayReveal'
    );
  }

  return master;
}