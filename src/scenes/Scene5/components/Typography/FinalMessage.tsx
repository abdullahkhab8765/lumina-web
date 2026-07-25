'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './Typography.module.css';
import { FINAL_MESSAGE_LINES } from '../../config/typographyConfig';

export interface FinalMessageHandle {
  lines: HTMLSpanElement[];
}

const FinalMessage = forwardRef<FinalMessageHandle>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get lines() {
        const container = containerRef.current;
        if (!container) return [];
        return Array.from(container.querySelectorAll<HTMLSpanElement>('[data-final-line]'));
      },
    }),
    []
  );

  return (
    <div ref={containerRef} className={styles.finalMessageGroup}>
      {FINAL_MESSAGE_LINES.map((line) => (
        <span
          key={line.id}
          data-final-line
          className={line.emphasis ? `${styles.finalMessageLine} ${styles.finalMessageEmphasis}` : styles.finalMessageLine}
        >
          {line.text}
        </span>
      ))}
    </div>
  );
});

FinalMessage.displayName = 'FinalMessage';

export default FinalMessage;