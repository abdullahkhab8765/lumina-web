'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './ContinueButton.module.css';

interface ContinueButtonProps {
  visible: boolean;
  onClick: () => void;
  label?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  visible,
  onClick,
  label = 'Continue',
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    if (visible) {
      gsap.set(el, { pointerEvents: 'auto' });
      tweenRef.current = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 16, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.set(el, { autoAlpha: 0, pointerEvents: 'none' });
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [visible]);

  const handleEnter = () => {
    gsap.to(btnRef.current, { scale: 1.045, duration: 0.35, ease: 'power2.out' });
  };

  const handleLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.35, ease: 'power2.out' });
  };

  const handlePress = () => {
    gsap.to(btnRef.current, { scale: 0.97, duration: 0.12, ease: 'power1.out' });
  };

  const handleRelease = () => {
    gsap.to(btnRef.current, { scale: 1.045, duration: 0.18, ease: 'power1.out' });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      className={styles.continueButton}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-label={label}
      tabIndex={visible ? 0 : -1}
    >
      <span className={styles.buttonLabel}>{label}</span>
    </button>
  );
};

export default ContinueButton;