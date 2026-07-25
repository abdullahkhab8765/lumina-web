'use client';

import React, { forwardRef } from 'react';
import styles from './Lighting.module.css';

const FireworkFlash = forwardRef<HTMLDivElement>((_props, ref) => {
  return <div ref={ref} className={styles.flash} aria-hidden="true" />;
});

FireworkFlash.displayName = 'FireworkFlash';

export default FireworkFlash;