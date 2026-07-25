'use client';

import React from 'react';
import styles from './ProgressIndicator.module.css';
import type { GiftStatus } from '../../types/scene3';

interface ProgressIndicatorProps {
  statuses: GiftStatus[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ statuses }) => {
  return (
    <div className={styles.wrapper} role="status" aria-label="Gift progress">
      {statuses.map((status, index) => (
        <span key={index} className={styles.dot} data-status={status} aria-hidden="true" />
      ))}
    </div>
  );
};

export default ProgressIndicator;