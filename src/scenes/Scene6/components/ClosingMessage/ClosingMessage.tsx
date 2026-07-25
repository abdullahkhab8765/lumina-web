'use client';

import React, { forwardRef } from 'react';
import styles from './ClosingMessage.module.css';
import { CLOSING_TITLE, CLOSING_SUBTITLE } from '../../config/creditsConfig';

const ClosingMessage = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <div ref={ref} className={styles.wrapper}>
      <h2 className={styles.title}>{CLOSING_TITLE}</h2>
      <p className={styles.subtitle}>{CLOSING_SUBTITLE}</p>
    </div>
  );
});

ClosingMessage.displayName = 'ClosingMessage';

export default ClosingMessage;