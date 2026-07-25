'use client';

import React, { forwardRef, type ReactNode } from 'react';
import styles from './CameraRig.module.css';

interface CameraRigProps {
  children: ReactNode;
}

const CameraRig = forwardRef<HTMLDivElement, CameraRigProps>(({ children }, ref) => {
  return (
    <div ref={ref} className={styles.rig}>
      {children}
    </div>
  );
});

CameraRig.displayName = 'CameraRig';

export default CameraRig;