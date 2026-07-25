"use client";

import { forwardRef } from "react";
import styles from "./LoadingBar.module.css";

export interface LoadingBarProps {
  className?: string;
}

/**
 * Presentational loading bar. Renders a static track and a fill element.
 * The fill element is exposed via `ref` so the Scene 1 master timeline can
 * animate its width directly; this component never animates itself.
 */
const LoadingBar = forwardRef<HTMLDivElement, LoadingBarProps>(function LoadingBar(
  { className },
  ref
) {
  return (
    <div className={`${styles.track} ${className ?? ""}`}>
      <div ref={ref} className={styles.fill} />
    </div>
  );
});

export default LoadingBar;