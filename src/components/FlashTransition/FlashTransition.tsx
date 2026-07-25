"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import styles from "./FlashTransition.module.css";

export interface FlashTransitionHandle {
  element: HTMLDivElement | null;
  /** Instantly sets the flash to fully visible, no animation. */
  show: () => void;
  /** Instantly sets the flash to fully hidden, no animation. */
  hide: () => void;
  /** Animates opacity 0 -> 1 -> 0. Resolves (and calls `onComplete`) when finished. */
  play: (options?: { peakDuration?: number; holdDuration?: number; fadeOutDuration?: number; onComplete?: () => void }) => gsap.core.Timeline;
}

export interface FlashTransitionProps {
  className?: string;
}

/**
 * Full-screen white flash overlay. Renders hidden and never animates on
 * mount — the parent must call `play()` (or `show()`/`hide()`) via the
 * exposed ref to trigger the transition.
 */
const FlashTransition = forwardRef<FlashTransitionHandle, FlashTransitionProps>(
  function FlashTransition({ className }, ref) {
    const elementRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        get element() {
          return elementRef.current;
        },
        show: () => {
          if (elementRef.current) {
            gsap.set(elementRef.current, { opacity: 1 });
          }
        },
        hide: () => {
          if (elementRef.current) {
            gsap.set(elementRef.current, { opacity: 0 });
          }
        },
        play: ({
          peakDuration = 0.16,
          holdDuration = 0.04,
          fadeOutDuration = 0.7,
          onComplete,
        } = {}) => {
          const tl = gsap.timeline({
            onComplete: () => onComplete?.(),
          });

          if (!elementRef.current) return tl;

          tl.set(elementRef.current, { opacity: 0 })
            .to(elementRef.current, { opacity: 1, duration: peakDuration, ease: "power1.in" })
            .to(elementRef.current, {
              opacity: 0,
              duration: fadeOutDuration,
              ease: "power2.out",
              delay: holdDuration,
            });

          return tl;
        },
      }),
      []
    );

    return <div ref={elementRef} className={`${styles.flash} ${className ?? ""}`} aria-hidden="true" />;
  }
);

export default FlashTransition;