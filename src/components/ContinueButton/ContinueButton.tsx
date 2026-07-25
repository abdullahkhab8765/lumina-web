"use client";

import { forwardRef } from "react";
import { useScene } from "@/context/SceneContext";
import styles from "./ContinueButton.module.css";

export interface ContinueButtonProps {
  label?: string;
  targetScene?: number;
}

/**
 * Continue CTA for Scene 1. Stays hidden (opacity 0, pointer-events none)
 * until the Scene 1 master timeline reveals it. Clicking advances the
 * experience via SceneContext.
 */
const ContinueButton = forwardRef<HTMLButtonElement, ContinueButtonProps>(function ContinueButton(
  { label = "Continue", targetScene = 2 },
  ref
) {
  const { changeScene } = useScene();

  const handleClick = () => {
    changeScene(targetScene);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={styles.button}
      aria-label={label}
    >
      {label}
    </button>
  );
});

export default ContinueButton;