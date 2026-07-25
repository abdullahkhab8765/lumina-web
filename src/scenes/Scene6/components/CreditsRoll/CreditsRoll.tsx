'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './CreditsRoll.module.css';
import { CREDIT_LINES } from '../../config/creditsConfig';

export interface CreditsRollHandle {
  viewport: HTMLDivElement | null;
  column: HTMLDivElement | null;
}

const CreditsRoll = forwardRef<CreditsRollHandle>((_props, ref) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const columnRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return viewportRef.current;
      },
      get column() {
        return columnRef.current;
      },
    }),
    []
  );

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={columnRef} className={styles.column}>
        {CREDIT_LINES.map((line) => (
          <div key={line.id} className={styles.entry}>
            {line.role && <span className={styles.role}>{line.role}</span>}
            <span className={styles.text}>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

CreditsRoll.displayName = 'CreditsRoll';

export default CreditsRoll;