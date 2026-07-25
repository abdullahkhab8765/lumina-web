'use client';

import { useEffect, type RefObject } from 'react';
import { createScene5Timeline, type Scene5TimelineRefs } from '../timeline/createScene5Timeline';
import type { FireworksHandle } from './useFireworks';
import type { FinaleAudioHandle } from './useFinaleAudio';
import type { ParticlesHandle } from './useParticles';

interface UseScene5TimelineOptions {
  isActive: boolean;
  refs: Scene5TimelineRefs;
  fireworksRef: RefObject<FireworksHandle | null>;
  audio: FinaleAudioHandle;
  particles: ParticlesHandle;
  onComplete: () => void;
}

function useScene5Timeline({ isActive, refs, fireworksRef, audio, particles, onComplete }: UseScene5TimelineOptions): void {
  useEffect(() => {
    if (!isActive) return;

    const fireworks = fireworksRef.current;
    if (!fireworks) return;

    const tl = createScene5Timeline(refs, fireworks, audio, particles, onComplete);
    tl.play();

    return () => {
      tl.kill();
      fireworks.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
}

export default useScene5Timeline;