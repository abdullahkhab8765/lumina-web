import { AudioController } from './audioController';
import { SCENE4_AUDIO_CONFIG } from './audioConfig';

/** Scene 4's background music path, exported for anything that needs
 * to reference it directly (mirrors scene3Audio.ts's convention). */
export const SCENE4_MUSIC_SRC = SCENE4_AUDIO_CONFIG.src;

/**
 * Creates a fresh, fully configured AudioController for Scene 4.
 * One instance should exist per Scene 4 activation — useScene4Audio.ts
 * creates one on mount and destroys it on unmount; nothing else
 * should construct one directly.
 */
export function createScene4AudioController(): AudioController {
  return new AudioController(SCENE4_AUDIO_CONFIG);
}