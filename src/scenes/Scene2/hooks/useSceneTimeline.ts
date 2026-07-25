import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface UseSceneTimelineOptions {
  paused?: boolean;
  onComplete?: () => void;
}

interface UseSceneTimelineControls {
  getTimeline: () => gsap.core.Timeline;
  kill: () => void;
}

function useSceneTimeline(
  active: boolean,
  build: (tl: gsap.core.Timeline) => void,
  options: UseSceneTimelineOptions = {}
): UseSceneTimelineControls {
  const { paused = false, onComplete } = options;
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const kill = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  const getTimeline = useCallback((): gsap.core.Timeline => {
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({ paused, onComplete });
    }
    return timelineRef.current;
  }, [paused, onComplete]);

  useEffect(() => {
    if (!active) return;

    const tl = gsap.timeline({ paused, onComplete });
    timelineRef.current = tl;
    build(tl);

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return {
    getTimeline,
    kill,
  };
}

export default useSceneTimeline;