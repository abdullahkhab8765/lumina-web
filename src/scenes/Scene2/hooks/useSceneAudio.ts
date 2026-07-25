import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface UseSceneAudioOptions {
  loop?: boolean;
  targetVolume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  /** Seconds to wait after play() is called before playback actually
   * starts and fades in. Defaults to 0 (starts immediately), which
   * preserves the hook's original behavior for existing callers. */
  startDelay?: number;
}

interface UseSceneAudioControls {
  play: () => void;
  fadeOutAndStop: (onComplete?: () => void) => void;
  stopImmediately: () => void;
}

function useSceneAudio(
  src: string,
  active: boolean,
  options: UseSceneAudioOptions = {}
): UseSceneAudioControls {
  const {
    loop = true,
    targetVolume = 0.35,
    fadeInDuration = 2.5,
    fadeOutDuration = 0.9,
    startDelay = 0,
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedStartRef = useRef<gsap.core.Tween | null>(null);
  const stoppedRef = useRef(false);
  const unlockHandlerRef = useRef<(() => void) | null>(null);

  const cancelDelayedStart = useCallback(() => {
    if (delayedStartRef.current) {
      delayedStartRef.current.kill();
      delayedStartRef.current = null;
    }
  }, []);

  const teardownUnlockListener = useCallback(() => {
    const handler = unlockHandlerRef.current;
    if (!handler || typeof window === 'undefined') return;
    window.removeEventListener('pointerdown', handler);
    window.removeEventListener('keydown', handler);
    window.removeEventListener('touchstart', handler);
    unlockHandlerRef.current = null;
  }, []);

  // Registers a one-shot recovery listener for the next real user
  // gesture anywhere on the page. This is what actually fires when a
  // play() call made asynchronously (e.g. a delayed track's fade-in)
  // gets rejected by browser autoplay policy — a plain gesture-adjacent
  // play() call, unlike a delayed one, doesn't need this at all.
  const armUnlockListener = useCallback(
    (retry: () => void) => {
      if (unlockHandlerRef.current || typeof window === 'undefined') return;

      const handler = () => {
        teardownUnlockListener();
        retry();
      };

      unlockHandlerRef.current = handler;
      window.addEventListener('pointerdown', handler);
      window.addEventListener('keydown', handler);
      window.addEventListener('touchstart', handler);
    },
    [teardownUnlockListener]
  );

  const stopImmediately = useCallback(() => {
    stoppedRef.current = true;
    cancelDelayedStart();
    teardownUnlockListener();

    if (fadeTweenRef.current) {
      fadeTweenRef.current.kill();
      fadeTweenRef.current = null;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [cancelDelayedStart, teardownUnlockListener]);

  const beginPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || stoppedRef.current) return;

    audio.play().catch((err) => {
      // Surfaced instead of swallowed — this is the exact failure
      // that previously hid the vocals track never starting. Most
      // likely browser autoplay policy rejecting a play() call that
      // happens asynchronously (via startDelay), disconnected from
      // the gesture that activated the scene.
      console.warn(`[useSceneAudio] play() blocked for "${src}":`, err);
      if (stoppedRef.current) return;
      armUnlockListener(() => beginPlayback());
    });

    if (fadeTweenRef.current) {
      fadeTweenRef.current.kill();
    }

    fadeTweenRef.current = gsap.to(audio, {
      volume: targetVolume,
      duration: fadeInDuration,
      ease: 'power1.inOut',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetVolume, fadeInDuration, armUnlockListener, src]);

  const play = useCallback(() => {
    if (!audioRef.current || stoppedRef.current) return;

    if (startDelay > 0) {
      cancelDelayedStart();
      delayedStartRef.current = gsap.delayedCall(startDelay, () => {
        delayedStartRef.current = null;
        beginPlayback();
      });
      return;
    }

    beginPlayback();
  }, [startDelay, cancelDelayedStart, beginPlayback]);

  const fadeOutAndStop = useCallback(
    (onComplete?: () => void) => {
      stoppedRef.current = true;
      teardownUnlockListener();

      const wasWaitingToStart = delayedStartRef.current !== null;
      cancelDelayedStart();

      const audio = audioRef.current;
      if (!audio || wasWaitingToStart) {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        onComplete?.();
        return;
      }

      if (fadeTweenRef.current) {
        fadeTweenRef.current.kill();
      }

      fadeTweenRef.current = gsap.to(audio, {
        volume: 0,
        duration: fadeOutDuration,
        ease: 'power1.inOut',
        onComplete: () => {
          audio.pause();
          audio.currentTime = 0;
          onComplete?.();
        },
      });
    },
    [fadeOutDuration, cancelDelayedStart, teardownUnlockListener]
  );

  useEffect(() => {
    if (!active) return;

    stoppedRef.current = false;
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      stoppedRef.current = true;

      teardownUnlockListener();
      if (delayedStartRef.current) {
        delayedStartRef.current.kill();
        delayedStartRef.current = null;
      }
      if (fadeTweenRef.current) {
        fadeTweenRef.current.kill();
        fadeTweenRef.current = null;
      }
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, src, loop]);

  return { play, fadeOutAndStop, stopImmediately };
}

export default useSceneAudio;