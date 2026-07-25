import { useCallback, useRef, useState } from 'react';
import { letterContent } from '../data/letterContent';
import { isLastParagraph } from '../utils/revealUtils';

interface CurrentParagraph {
  id: number;
  text: string;
}

interface UseParagraphFlowResult {
  activeIndex: number;
  currentParagraph: CurrentParagraph;
  isLast: boolean;
  isRevealed: boolean;
  markRevealed: () => void;
  advance: () => void;
}

function useParagraphFlow(onComplete: () => void): UseParagraphFlowResult {
  const total = letterContent.paragraphs.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const completingRef = useRef(false);

  const isLast = isLastParagraph(activeIndex, total);
  const currentParagraph = letterContent.paragraphs[activeIndex];

  const markRevealed = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const advance = useCallback(() => {
    if (!isRevealed) return;

    if (isLast) {
      if (completingRef.current) return;
      completingRef.current = true;
      onComplete();
      return;
    }

    setIsRevealed(false);
    setActiveIndex((prev) => Math.min(prev + 1, total - 1));
  }, [isRevealed, isLast, onComplete, total]);

  return { activeIndex, currentParagraph, isLast, isRevealed, markRevealed, advance };
}

export default useParagraphFlow;