'use client';

import { useEffect, useRef, useCallback } from 'react';
import { SCENE1_THEME_CONFIG, SCENE1_FIREWORKS_SFX_CONFIG } from '../config/audioConfig';
import { Scene1AudioManager } from '../utils/scene1AudioManager';

interface UseScene1AudioControls {
  /** Starts the looping theme with a fade-in. Idempotent — call it
   * freely on every countdown tick; only the first call acts. */
  startTheme: () => void;
  /** Plays the fireworks sfx once. Idempotent per mount. */
  playFireworksSfx: () => void;
}

/**
 * Owns a single Scene1AudioManager instance for the lifetime of this
 * component. Creation and teardown both happen exactly once, in an
 * effect with an empty dependency array, so no duplicate Audio
 * instances can be created across re-renders.
 */
function useScene1Audio(): UseScene1AudioControls {
  const managerRef = useRef<Scene1AudioManager | null>(null);

  useEffect(() => {
    const manager = new Scene1AudioManager(SCENE1_THEME_CONFIG, SCENE1_FIREWORKS_SFX_CONFIG);
    managerRef.current = manager;

    return () => {
      // Scene1 only unmounts when the user clicks Continue and
      // SceneManager swaps to Scene 2. shutdown() fades the theme out
      // and stops both tracks; its GSAP tween keeps running via the
      // global ticker even after this cleanup returns, so the fade
      // completes smoothly instead of cutting off mid-fade.
      manager.shutdown();
      managerRef.current = null;
    };
  }, []);

  const startTheme = useCallback(() => {
    managerRef.current?.startTheme();
  }, []);

  const playFireworksSfx = useCallback(() => {
    managerRef.current?.playFireworksOnce();
  }, []);

  return { startTheme, playFireworksSfx };
}

export default useScene1Audio;