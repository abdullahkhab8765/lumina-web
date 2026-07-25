'use client';

import React, { forwardRef, type ReactNode } from 'react';
import styles from './FinaleSky.module.css';

interface FinaleSkyProps {
  children: ReactNode;
}

const FinaleSky = forwardRef<HTMLDivElement, FinaleSkyProps>(({ children }, ref) => {
  return (
    <div ref={ref} className={styles.sky}>
      {children}
    </div>
  );
});

FinaleSky.displayName = 'FinaleSky';

export default FinaleSky;