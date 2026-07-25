'use client';

import React, { forwardRef } from 'react';
import styles from './Ending.module.css';

const FadeToBlack = forwardRef<HTMLDivElement>((_props, ref) => {
  return <div ref={ref} className={styles.fadeToBlack} aria-hidden="true" />;
});

FadeToBlack.displayName = 'FadeToBlack';

export default FadeToBlack;