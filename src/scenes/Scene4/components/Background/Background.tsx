'use client';

import React from 'react';
import styles from './Background.module.css';

const Background: React.FC = () => {
  return (
    <div className={styles.backgroundRoot} aria-hidden="true">
      <div className={styles.baseGradient} />
      <div className={styles.centerGlow} />
      <div className={styles.vignette} />
    </div>
  );
};

export default Background;