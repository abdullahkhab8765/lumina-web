"use client";

import { forwardRef } from "react";
import styles from "./CinematicText.module.css";

export interface CinematicTextProps {
  text?: string;
  className?: string;
}

/**
 * Renders a single line of cinematic copy over the black screen (e.g.
 * "Preparing Something Special..."). Purely presentational — exposes its
 * root element via `ref` so the Scene 1 master timeline can animate it.
 * Never animates itself.
 */
const CinematicText = forwardRef<HTMLParagraphElement, CinematicTextProps>(function CinematicText(
  { text = "Preparing Something Special...", className },
  ref
) {
  return (
    <p ref={ref} className={`${styles.text} ${className ?? ""}`}>
      {text}
    </p>
  );
});

export default CinematicText;