'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AudioController } from './audioController';
import { createScene4AudioController } from './scene4Audio';
import { SCENE4_AUDIO_CONFIG } from './audioConfig';

export type Scene4Paragraph = 1 | 2 | 3 | 4;

interface UseScene4AudioControls {
  setParagraphVolume: (paragraph: Scene4Paragraph) => void;
  fadeOutAndStop: (onComplete?: () => void) => void;
}

/**
 * Owns Scene 4's single background-music controller for the scene's
 * active lifetime.
 *
 * fadeOutAndStop() is the ONE authoritative teardown path used for
 * the Scene 4 -> Scene 5 hand-off (see Scene4.tsx's
 * handleSceneComplete). The mount effect's cleanup below is only a
 * safety net for the rare case where Scene 4 unmounts WITHOUT
 * fadeOutAndStop() having run first -- it performs an immediate,
 * synchronous destroy() rather than starting a second, competing
 * fade. This matters: an earlier version of this hook had the
 * cleanup start its own async fadeOut() independently of
 * fadeOutAndStop()'s fade, which could race the graceful fade on the
 * same <audio> element and leave it never fully paused -- audible
 * at the same time as Scene 5's music. With a single fade path and a
 * synchronous-only fallback, that race can no longer happen.
 */
function useScene4Audio(isActive: boolean): UseScene4AudioControls {
  const controllerRef = useRef<AudioController | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const controller = createScene4AudioController();
    controllerRef.current = controller;

    controller.playAndFadeIn(
      SCENE4_AUDIO_CONFIG.fadeInTargetVolume,
      SCENE4_AUDIO_CONFIG.fadeInDuration
    );

    return () => {
      // Safety net only -- never a second fade. If fadeOutAndStop()
      // already ran (the normal Scene 4 -> Scene 5 hand-off),
      // controller.destroy() below is a guaranteed no-op (the
      // controller guards against double-destroy internally). If it
      // hasn't run (component unmounted some other way), this stops
      // playback immediately instead of starting a competing fade,
      // so it can never race fadeOutAndStop()'s fade on the same
      // audio element.
      controller.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const setParagraphVolume = useCallback((paragraph: Scene4Paragraph) => {
    const controller = controllerRef.current;
    if (!controller) return;

    const targetVolume = SCENE4_AUDIO_CONFIG.paragraphVolumes[`paragraph${paragraph}`];
    controller.fadeIn(targetVolume, SCENE4_AUDIO_CONFIG.paragraphTransitionDuration);
  }, []);

  /**
   * The single authoritative Scene 4 -> Scene 5 hand-off path. Fades
   * this controller's audio all the way to silence, pauses it, and
   * destroys it -- and ONLY THEN invokes onComplete (Scene4.tsx wires
   * this to the real onComplete prop, which SceneManager uses to
   * changeScene(5)). Because Scene 5 only mounts once this callback
   * fires, Scene 5 -- and therefore its own music -- cannot start
   * until Scene 4's music has been fully faded, paused, and released.
   * controllerRef.current is nulled immediately (before the fade even
   * starts), so nothing else in this hook, including the mount
   * effect's cleanup above, can act on this controller again or start
   * a second, competing fade on the same audio element.
   */
  const fadeOutAndStop = useCallback((onComplete?: () => void) => {
    const controller = controllerRef.current;
    controllerRef.current = null;

    if (!controller) {
      onComplete?.();
      return;
    }

    controller.fadeOut(SCENE4_AUDIO_CONFIG.fadeOutDuration, () => {
      controller.destroy();
      onComplete?.();
    });
  }, []);

  return { setParagraphVolume, fadeOutAndStop };
}

export default useScene4Audio;