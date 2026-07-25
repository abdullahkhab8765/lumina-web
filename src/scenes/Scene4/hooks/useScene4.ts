import { useEffect, type RefObject } from 'react';
import { createScene4EntranceTimeline } from '../animations/scene4Timeline';
import { createCameraZoomTween } from '../animations/cameraAnimation';
import { SCENE4_FADE_IN_DURATION } from '../constants/scene4';

interface UseScene4Refs {
  container: RefObject<HTMLDivElement | null>;
  overlay: RefObject<HTMLDivElement | null>;
  camera: RefObject<HTMLDivElement | null>;
}

function useScene4(isActive: boolean, refs: UseScene4Refs): void {
  useEffect(() => {
    if (!isActive) return;

    const container = refs.container.current;
    const overlay = refs.overlay.current;
    const camera = refs.camera.current;
    if (!container) return;

    const tl = createScene4EntranceTimeline(
      { container, overlay },
      { fadeInDuration: SCENE4_FADE_IN_DURATION }
    );

    const cameraTween = createCameraZoomTween(camera);

    return () => {
      tl.kill();
      cameraTween?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
}

export default useScene4;