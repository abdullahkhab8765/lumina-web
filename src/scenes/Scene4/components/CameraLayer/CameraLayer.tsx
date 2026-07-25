'use client';

import React, { forwardRef, type ReactNode } from 'react';
import styles from './CameraLayer.module.css';

interface CameraLayerProps {
  children: ReactNode;
}

const CameraLayer = forwardRef<HTMLDivElement, CameraLayerProps>(({ children }, ref) => {
  return (
    <div ref={ref} className={styles.cameraRoot}>
      {children}
    </div>
  );
});

CameraLayer.displayName = 'CameraLayer';

export default CameraLayer;