'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './Typography.module.css';
import { BLESSING_LINES } from '../../config/typographyConfig';

export interface BlessingTextHandle {
  lines: HTMLSpanElement[];
}

const BlessingText = forwardRef<BlessingTextHandle>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get lines() {
        const container = containerRef.current;
        if (!container) return [];
        return Array.from(container.querySelectorAll<HTMLSpanElement>('[data-blessing-line]'));
      },
    }),
    []
  );

  return (
    <div ref={containerRef} className={styles.blessingGroup}>
      {BLESSING_LINES.map((line) => (
        <span key={line.id} data-blessing-line className={styles.blessingLine}>
          {line.text}
        </span>
      ))}
    </div>
  );
});

BlessingText.displayName = 'BlessingText';

export default BlessingText;