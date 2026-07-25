import { useEffect, type RefObject } from 'react';
import { createScene3EntranceTimeline } from '../animations/scene3Timeline';
import { SCENE3_FADE_IN_DURATION } from '../constants/scene3';

interface UseScene3Refs {
  container: RefObject<HTMLDivElement | null>;
  background: RefObject<HTMLDivElement | null>;
  grid: RefObject<HTMLDivElement | null>;
}

function useScene3(isActive: boolean, refs: UseScene3Refs): void {
  useEffect(() => {
    if (!isActive) return;

    const container = refs.container.current;
    const background = refs.background.current;
    const grid = refs.grid.current;
    if (!container) return;

    const tl = createScene3EntranceTimeline(
      { container, background, grid },
      { fadeInDuration: SCENE3_FADE_IN_DURATION }
    );

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
}

export default useScene3;