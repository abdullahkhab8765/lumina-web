'use client';

import React, { forwardRef } from 'react';
import styles from './ReplayButton.module.css';
import { REPLAY_LABEL } from '../../config/creditsConfig';

interface ReplayButtonProps {
  onReplay: () => void;
}

const ReplayButton = forwardRef<HTMLButtonElement, ReplayButtonProps>(({ onReplay }, ref) => {
  return (
    <button ref={ref} type="button" className={styles.button} onClick={onReplay}>
      {REPLAY_LABEL}
    </button>
  );
});

ReplayButton.displayName = 'ReplayButton';

export default ReplayButton;