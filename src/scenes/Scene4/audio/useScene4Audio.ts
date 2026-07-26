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

function useScene4Audio(isActive: boolean): UseScene4AudioControls {
  // TEMP DIAGNOSTIC — remove once the break point is found.
  console.log('[Scene4Audio] useScene4Audio() called, isActive =', isActive);

  const controllerRef = useRef<AudioController | null>(null);

  useEffect(() => {
    console.log('[Scene4Audio] mount effect running, isActive =', isActive);
    if (!isActive) {
      console.log('[Scene4Audio] mount effect bailed: isActive is false');
      return;
    }

    console.log('[Scene4Audio] creating controller + calling playAndFadeIn()');
    const controller = createScene4AudioController();
    controllerRef.current = controller;

    controller.playAndFadeIn(
      SCENE4_AUDIO_CONFIG.fadeInTargetVolume,
      SCENE4_AUDIO_CONFIG.fadeInDuration
    );

    return () => {
      console.log('[Scene4Audio] mount effect CLEANUP firing (unmount or isActive changed) -- fading out + destroying');
      controller.fadeOut(SCENE4_AUDIO_CONFIG.fadeOutDuration, () => {
        console.log('[Scene4Audio] fadeOut complete, calling destroy()');
        controller.destroy();
      });
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    return () => {
      console.log('[Scene4Audio] safety-net cleanup firing (component fully unmounting)');
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  const setParagraphVolume = useCallback((paragraph: Scene4Paragraph) => {
    console.log('[Scene4Audio] setParagraphVolume() called with paragraph =', paragraph);
    const controller = controllerRef.current;
    if (!controller) {
      console.log('[Scene4Audio] setParagraphVolume() bailed: controllerRef.current is null');
      return;
    }

    const targetVolume = SCENE4_AUDIO_CONFIG.paragraphVolumes[`paragraph${paragraph}`];
    console.log('[Scene4Audio] calling fadeIn() with targetVolume =', targetVolume);
    controller.fadeIn(targetVolume, SCENE4_AUDIO_CONFIG.paragraphTransitionDuration);
  }, []);

  const fadeOutAndStop = useCallback((onComplete?: () => void) => {
    console.log('[Scene4Audio] fadeOutAndStop() called explicitly');
    const controller = controllerRef.current;
    if (!controller) {
      onComplete?.();
      return;
    }

    controller.fadeOut(SCENE4_AUDIO_CONFIG.fadeOutDuration, () => {
      controller.destroy();
      onComplete?.();
    });
    controllerRef.current = null;
  }, []);

  return { setParagraphVolume, fadeOutAndStop };
}

export default useScene4Audio;