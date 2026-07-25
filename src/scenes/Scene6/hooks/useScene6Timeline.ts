'use client';

import { useEffect } from 'react';
import { createScene6Timeline, type Scene6TimelineRefs } from '../timeline/createScene6Timeline';

function useScene6Timeline(isActive: boolean, refs: Scene6TimelineRefs): void {
  useEffect(() => {
    if (!isActive) return;

    const tl = createScene6Timeline(refs);
    tl.play();

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
}

export default useScene6Timeline;