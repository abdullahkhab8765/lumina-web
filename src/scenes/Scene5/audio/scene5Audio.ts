import { AudioController } from './audioController';
import { SCENE5_AUDIO_CONFIG } from './audioConfig';

/** Scene 5's background music path, exported for anything that needs
 * to reference it directly (mirrors scene4Audio.ts's convention). */
export const SCENE5_MUSIC_SRC = SCENE5_AUDIO_CONFIG.src;

/**
 * Creates a fresh, fully configured AudioController for Scene 5.
 * One instance should exist per Scene 5 activation — useScene5Audio.ts
 * creates one on mount and destroys it on unmount; nothing else
 * should construct one directly.
 */
export function createScene5AudioController(): AudioController {
  return new AudioController(SCENE5_AUDIO_CONFIG);
}