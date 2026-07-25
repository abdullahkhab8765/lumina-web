import { useEffect, type RefObject } from 'react';
import { createPaperEntranceTimeline, createPaperBreathingTween } from '../animations/paperAnimation';

interface UseLetterAnimationRefs {
  paper: RefObject<HTMLDivElement | null>;
}

function useLetterAnimation(isActive: boolean, refs: UseLetterAnimationRefs): void {
  useEffect(() => {
    if (!isActive) return;

    const paper = refs.paper.current;
    if (!paper) return;

    const entranceTl = createPaperEntranceTimeline(paper);
    let breathingTween: ReturnType<typeof createPaperBreathingTween> = null;

    entranceTl.eventCallback('onComplete', () => {
      breathingTween = createPaperBreathingTween(paper);
    });

    return () => {
      entranceTl.kill();
      breathingTween?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
}

export default useLetterAnimation;