'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './IntroGate.module.css';

export interface IntroGateProps {
  /** Called once, after the exit animation finishes, in response to a
   * real user gesture (click, tap, Enter, or Space). This is the
   * gesture that unlocks browser audio for the rest of the page's
   * lifetime — Scene1's own audio system relies on it having
   * happened before its first play() attempt. */
  onEnter: () => void;
}

const EXIT_DURATION = 0.6;

const IntroGate: React.FC<IntroGateProps> = ({ onEnter }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);
  const hasExitedRef = useRef(false);

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([glowRef.current, titleRef.current, subtitleRef.current], {
          opacity: 1,
          clearProps: 'transform,filter',
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.set([glowRef.current, titleRef.current, subtitleRef.current], { opacity: 0 });
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power1.inOut' },
        0
      );
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
        0.3
      );
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.7
      );

      pulseTweenRef.current = gsap.to(subtitleRef.current, {
        opacity: 0.45,
        duration: 1.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      });
    }, rootRef);

    return () => {
      pulseTweenRef.current?.kill();
      pulseTweenRef.current = null;
      ctx.revert();
    };
  }, []);

  const handleEnter = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    pulseTweenRef.current?.kill();

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      onEnter();
      return;
    }

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: EXIT_DURATION,
      ease: 'power1.inOut',
      onComplete: () => {
        onEnter();
      },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      handleEnter();
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    // Prevent the browser's synthesized 'click' that normally follows
    // 'touchend' from also calling handleEnter (it's idempotent via
    // hasExitedRef, but this avoids the redundant call entirely).
    event.preventDefault();
    handleEnter();
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere to begin the experience"
      onClick={handleEnter}
      onKeyDown={handleKeyDown}
      onTouchEnd={handleTouchEnd}
      autoFocus
    >
      <div ref={glowRef} className={styles.glow} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.content}>
        <p ref={titleRef} className={styles.title}>
          A Special Experience Awaits...
        </p>
        <p ref={subtitleRef} className={styles.subtitle}>
          Click Anywhere To Begin
        </p>
      </div>
    </div>
  );
};

export default IntroGate;