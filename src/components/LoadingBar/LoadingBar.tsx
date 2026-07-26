"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "./LoadingBar.module.css";

export interface LoadingBarHandle {
  /** Outer track/pill element (the always-visible background bar). */
  track: HTMLDivElement | null;
  /** Fill element — the Scene 1 master timeline animates its width directly. */
  fill: HTMLDivElement | null;
}

export interface LoadingBarProps {
  className?: string;
}

/**
 * Presentational loading bar. Renders a static track and a fill element.
 * The fill element's width is animated by the Scene 1 master timeline via
 * the exposed handle; the track element is also exposed so the timeline can
 * fade the whole bar out, but this component never animates itself.
 */
const LoadingBar = forwardRef<LoadingBarHandle, LoadingBarProps>(function LoadingBar(
  { className },
  ref
) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get track() {
        return trackRef.current;
      },
      get fill() {
        return fillRef.current;
      },
    }),
    []
  );

  return (
    <div ref={trackRef} className={`${styles.track} ${className ?? ""}`}>
      <div ref={fillRef} className={styles.fill} />
    </div>
  );
});

export default LoadingBar;