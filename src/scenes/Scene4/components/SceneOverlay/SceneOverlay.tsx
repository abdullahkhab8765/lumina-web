'use client';

import React, { forwardRef } from 'react';
import styles from './SceneOverlay.module.css';

const SceneOverlay = forwardRef<HTMLDivElement>((_props, ref) => {
  return <div ref={ref} className={styles.overlay} aria-hidden="true" />;
});

SceneOverlay.displayName = 'SceneOverlay';

export default SceneOverlay;