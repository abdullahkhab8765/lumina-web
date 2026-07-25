'use client';

import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FINALE_AUDIO_SRC, FINALE_AUDIO_QUIET_VOLUME, FINALE_AUDIO_FADE_OUT_DURATION } from '../config/scene5Config';

export interface FinaleAudioHandle {
  play: () => void;
  swellTo: (volume: number, duration: number) => void;
  fadeOutAndStop: (duration?: number, onComplete?: () => void) => void;
  stopImmediately: () => void;
}

interface UseFinaleAudioOptions {
  active: boolean;
  src?: string;
}

function useFinaleAudio({ active, src = FINALE_AUDIO_SRC }: UseFinaleAudioOptions): FinaleAudioHandle {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {
      // Autoplay may be blocked until user interaction; safe to ignore.
    });
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(audio, {
      volume: FINALE_AUDIO_QUIET_VOLUME,
      duration: 2,
      ease: 'power1.inOut',
    });
  }, []);

  const swellTo = useCallback((volume: number, duration: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(audio, { volume, duration, ease: 'power2.inOut' });
  }, []);

  const fadeOutAndStop = useCallback((duration = FINALE_AUDIO_FADE_OUT_DURATION, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) {
      onComplete?.();
      return;
    }
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(audio, {
      volume: 0,
      duration,
      ease: 'power1.inOut',
      onComplete: () => {
        audio.pause();
        audio.currentTime = 0;
        onComplete?.();
      },
    });
  }, []);

  const stopImmediately = useCallback(() => {
    tweenRef.current?.kill();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    const audio = new Audio(src);
    audio.loop = false;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      tweenRef.current?.kill();
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [active, src]);

  return { play, swellTo, fadeOutAndStop, stopImmediately };
}

export default useFinaleAudio;