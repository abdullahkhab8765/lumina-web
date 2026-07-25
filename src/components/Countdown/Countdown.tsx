"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "./Countdown.module.css";

export interface CountdownHandle {
  element: HTMLSpanElement | null;
  setValue: (value: number) => void;
}

export interface CountdownProps {
  className?: string;
}

/**
 * Displays a single countdown numeral. The Scene 1 master timeline is the
 * only thing that advances the value (via `setValue`) and animates the
 * exposed `element`; this component never uses `setInterval` and never
 * animates or updates itself. Hidden from assistive tech since the
 * countdown is purely visual scene-setting, not content.
 */
const Countdown = forwardRef<CountdownHandle, CountdownProps>(function Countdown(
  { className },
  ref
) {
  const numberRef = useRef<HTMLSpanElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return numberRef.current;
      },
      setValue: (value: number) => {
        if (numberRef.current) {
          numberRef.current.textContent = String(value);
        }
      },
    }),
    []
  );

  return (
    <span
      ref={numberRef}
      className={`${styles.number} ${className ?? ""}`}
      aria-hidden="true"
    />
  );
});

export default Countdown;