'use client';

import React from 'react';
import styles from './Backdrop.module.css';

const Backdrop: React.FC = () => {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.glow} />
    </div>
  );
};

export default Backdrop;