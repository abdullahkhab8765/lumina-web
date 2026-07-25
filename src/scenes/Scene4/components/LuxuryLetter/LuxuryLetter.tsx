'use client';

import React, { forwardRef, type ReactNode } from 'react';
import styles from './LuxuryLetter.module.css';

interface LuxuryLetterProps {
  children: ReactNode;
}

const LuxuryLetter = forwardRef<HTMLDivElement, LuxuryLetterProps>(({ children }, ref) => {
  return (
    <div ref={ref} className={styles.paper} role="region" aria-label="Birthday letter">
      <div className={styles.paperGlow} aria-hidden="true" />
      <div className={styles.paperBorder} aria-hidden="true" />
      <div className={styles.paperContent}>{children}</div>
    </div>
  );
});

LuxuryLetter.displayName = 'LuxuryLetter';

export default LuxuryLetter;