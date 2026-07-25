'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import styles from './ParagraphReveal.module.css';
import { createParagraphRevealTimeline, createParagraphExitTimeline } from '../../animations/paragraphReveal';
import { splitIntoWords } from '../../utils/typography';

export interface ParagraphRevealHandle {
  playExit: (onComplete: () => void) => void;
}

interface ParagraphRevealProps {
  paragraphId: number;
  text: string;
  startDelay?: number;
  onRevealComplete: () => void;
}

const ParagraphReveal = forwardRef<ParagraphRevealHandle, ParagraphRevealProps>(
  ({ paragraphId, text, startDelay = 0, onRevealComplete }, ref) => {
    const containerRef = useRef<HTMLParagraphElement | null>(null);
    const words = useMemo(() => splitIntoWords(text), [text]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const wordNodes = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-word]'));
      const tl = createParagraphRevealTimeline(wordNodes, {
        delay: startDelay,
        onComplete: onRevealComplete,
      });

      return () => {
        tl.kill();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paragraphId]);

    useImperativeHandle(
      ref,
      () => ({
        playExit: (onComplete: () => void) => {
          createParagraphExitTimeline(containerRef.current, onComplete);
        },
      }),
      []
    );

    return (
      <p ref={containerRef} className={styles.paragraph}>
        {words.map((word, i) => (
          <span key={`${paragraphId}-${i}`} data-word className={styles.word}>
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </p>
    );
  }
);

ParagraphReveal.displayName = 'ParagraphReveal';

export default ParagraphReveal;