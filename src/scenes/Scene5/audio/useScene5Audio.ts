'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AudioController } from './audioController';
import { createScene5AudioController } from './scene5Audio';
import { SCENE5_AUDIO_CONFIG } from './audioConfig';

interface UseScene5AudioControls {
  /** Starts playback and fades in to the configured target volume.
   * Call this from Scene 5's master GSAP timeline at the point the
   * finale music should begin — playback does not start on mount,
   * so the caller controls exactly when it enters, keeping it
   * synchronized with the timeline rather than racing it. */
  start: () => void;
  /** Fades the music out and stops it. Call this from the timeline
   * at the finale's natural end. Also runs automatically on unmount
   * as a safety net, so calling it explicitly is optional but
   * preferred for a clean, intentional handoff out of Scene 5. */
  fadeOutAndStop: () => void;
}

/**
 * Owns Scene 5's single background-music controller for the scene's
 * active lifetime. Unlike Scene 4's hook, this one does not
 * auto-play on mount — Scene 5's finale music needs to start at a
 * specific point in its own GSAP master timeline, so playback is
 * exposed as an imperative start() control instead, following the
 * same "timeline calls into audio" pattern already used for Scene 1.
 * The controller itself is still created eagerly on mount so the
 * track is preloaded and ready the moment start() is called.
 */
function useScene5Audio(isActive: boolean): UseScene5AudioControls {
  const controllerRef = useRef<AudioController | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const controller = createScene5AudioController();
    controllerRef.current = controller;

    return () => {
      // fadeOut's GSAP tween keeps running via the global ticker even
      // after this effect's cleanup returns and the component has
      // unmounted, so the fade completes smoothly rather than being
      // cut off — destroy() only runs once that fade finishes.
      controller.fadeOut(SCENE5_AUDIO_CONFIG.fadeOutDuration, () => {
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

  const start = useCallback(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    controller.playAndFadeIn(
      SCENE5_AUDIO_CONFIG.targetVolume,
      SCENE5_AUDIO_CONFIG.fadeInDuration
    );
  }, []);

  const fadeOutAndStop = useCallback(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    controller.fadeOut(SCENE5_AUDIO_CONFIG.fadeOutDuration, () => {
      controller.destroy();
    });
    controllerRef.current = null;
  }, []);

  return { start, fadeOutAndStop };
}

export default useScene5Audio;