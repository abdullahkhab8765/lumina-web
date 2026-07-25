'use client';

import React, { forwardRef, useImperativeHandle, useRef, type RefObject } from 'react';
import styles from './Fireworks.module.css';
import useFireworks, { type FireworksHandle } from '../../hooks/useFireworks';

interface FireworksProps {
  lightingRef?: RefObject<HTMLDivElement | null>;
}

const Fireworks = forwardRef<FireworksHandle, FireworksProps>(({ lightingRef }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const api = useFireworks({ canvasRef, lightingRef });

  useImperativeHandle(ref, () => api, [api]);

  return (
    <div className={styles.canvasWrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
});

Fireworks.displayName = 'Fireworks';

export default Fireworks;