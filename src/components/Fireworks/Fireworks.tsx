"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFireworks } from "@/hooks/useFireworks";
import styles from "./Fireworks.module.css";

export interface FireworksHandle {
  element: HTMLDivElement | null;
  start: () => void;
  stop: () => void;
}

export interface FireworksProps {
  className?: string;
}

/**
 * Full-screen canvas fireworks layer. Sets up its canvas/resize handling
 * on mount but never starts the animation loop on its own — `start()` and
 * `stop()` are exposed for the Scene 1 master timeline to call explicitly.
 */
const Fireworks = forwardRef<FireworksHandle, FireworksProps>(function Fireworks(
  { className },
  ref
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { canvasRef, start, stop } = useFireworks();

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return wrapperRef.current;
      },
      start,
      stop,
    }),
    [start, stop]
  );

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className ?? ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
});

export default Fireworks;