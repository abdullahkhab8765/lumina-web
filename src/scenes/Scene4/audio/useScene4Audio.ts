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
  const controllerRef = useRef<AudioController | null>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const controller = createScene4AudioController();
    controllerRef.current = controller;

    controller.playAndFadeIn(
      SCENE4_AUDIO_CONFIG.fadeInTargetVolume,
      SCENE4_AUDIO_CONFIG.fadeInDuration
    );

    return () => {
      controller.fadeOut(SCENE4_AUDIO_CONFIG.fadeOutDuration, () => {
        controller.destroy();
      });
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  const setParagraphVolume = useCallback((paragraph: Scene4Paragraph) => {
    const controller = controllerRef.current;
    if (!controller) {
      return;
    }

    const targetVolume = SCENE4_AUDIO_CONFIG.paragraphVolumes[`paragraph${paragraph}`];
    controller.fadeIn(targetVolume, SCENE4_AUDIO_CONFIG.paragraphTransitionDuration);
  }, []);

  const fadeOutAndStop = useCallback((onComplete?: () => void) => {
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
