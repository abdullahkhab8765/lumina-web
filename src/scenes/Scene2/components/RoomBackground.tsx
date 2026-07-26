'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './RoomBackground.module.css';

const RoomBackground: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 480px)',
        isDesktop: '(min-width: 481px)',
      },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };

        // Desktop values are byte-identical to the original implementation.
        gsap.set(el, {
          scale: isMobile ? 1.0 : 1.05,
          xPercent: 0,
          yPercent: 0,
          transformOrigin: '50% 45%',
          force3D: true,
        });

        const tween = gsap.to(el, {
          scale: isMobile ? 1.04 : 1.16,
          xPercent: isMobile ? -1 : -2.5,
          yPercent: isMobile ? -0.5 : -1.5,
          duration: 26,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        tweenRef.current = tween;

        return () => {
          tween.kill();
          tweenRef.current = null;
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.roomWrapper}>
      <img
        ref={imgRef}
        src="/images/luxury-room-cake.png"
        alt=""
        className={styles.roomImage}
        draggable={false}
      />
    </div>
  );
};

export default RoomBackground;