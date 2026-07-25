"use client";

import { forwardRef } from "react";
import styles from "./BirthdayTitle.module.css";

export interface BirthdayTitleProps {
  className?: string;
  heading?: string;
  name?: string;
}

/**
 * Static "Happy Birthday" / name markup. Renders once and never animates
 * itself — the Scene 1 master timeline animates the root element (exposed
 * via `ref`) as a single unit.
 */
const BirthdayTitle = forwardRef<HTMLDivElement, BirthdayTitleProps>(function BirthdayTitle(
  { className, heading = "Happy Birthday", name = "Aima" },
  ref
) {
  return (
    <div ref={ref} className={`${styles.root} ${className ?? ""}`}>
      <h1 className={styles.heading}>{heading}</h1>
      <h2 className={styles.name}>{name}</h2>
    </div>
  );
});

export default BirthdayTitle;