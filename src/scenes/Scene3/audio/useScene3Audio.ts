'use client';

import { useEffect, useRef } from 'react';
import { AudioController } from './audioController';
import { SCENE3_MUSIC_SRC } from './scene3Audio';
import { SCENE3_AUDIO_CONFIG } from './audioConfig';

/**
 * Owns Scene 3's single background-music controller for the scene's
 * active lifetime. Starts ~2s after activation, fades in, plays
 * continuously through all 5 gifts (never restarted between them —
 * there is nothing in this hook that reacts to gift progress), and
 * fades out on exit. Scene 3 only unmounts when the user clicks
 * Continue (SceneManager swaps away), so "fade out when Scene 3
 * finishes" and "fade out on unmount" are the same event here — the
 * same pattern already used for Scene 1 and Scene 2's audio.
 */
function useScene3Audio(isActive: boolean): void {
  const controllerRef = useRef<AudioController | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const controller = new AudioController(SCENE3_MUSIC_SRC, SCENE3_AUDIO_CONFIG);
    controllerRef.current = controller;

    controller.scheduleFadeIn(
      SCENE3_AUDIO_CONFIG.startDelay,
      SCENE3_AUDIO_CONFIG.maxVolume,
      SCENE3_AUDIO_CONFIG.fadeInDuration
    );

    return () => {
      // fadeOut's GSAP tween keeps running via the global ticker even
      // after this effect's cleanup returns and the component has
      // unmounted, so the fade completes smoothly rather than being
      // cut off — destroy() only runs once that fade finishes.
      controller.fadeOut(SCENE3_AUDIO_CONFIG.fadeOutDuration, () => {
        controller.destroy();
      });
      controllerRef.current = null;
    };
  }, [isActive]);

  // Safety net: guarantees teardown even if this hook's owner
  // unmounts through some path other than isActive flipping false.
  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);
}

export default useScene3Audio;