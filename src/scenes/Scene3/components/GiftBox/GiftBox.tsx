'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import styles from './GiftBox.module.css';
import { createGiftOpenTimeline, createGiftUnlockTimeline } from '../../animations/giftOpeningTimeline';
import { createSeededPoints } from '../../utils/scene3Helpers';
import {
  GIFT_OPEN_PARTICLE_COUNT,
  GIFT_HOVER_LIFT,
  GIFT_HOVER_DURATION,
  GIFT_UNLOCK_PULSE_DURATION,
} from '../../constants/scene3';
import type { GiftStatus } from '../../types/scene3';

interface GiftBoxProps {
  index: number;
  status: GiftStatus;
  isOpening: boolean;
  onOpen: (index: number) => void;
  onOpenAnimationComplete: (index: number) => void;
}

const GiftBox: React.FC<GiftBoxProps> = ({
  index,
  status,
  isOpening,
  onOpen,
  onOpenAnimationComplete,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);

  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const unlockTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null);
  const wasActiveRef = useRef(false);

  const particles = useMemo(
    () => createSeededPoints(GIFT_OPEN_PARTICLE_COUNT, index + 1),
    [index]
  );

  useEffect(() => {
    if (status === 'active' && !wasActiveRef.current) {
      unlockTimelineRef.current = createGiftUnlockTimeline(rootRef.current, {
        duration: GIFT_UNLOCK_PULSE_DURATION,
      });
    }
    wasActiveRef.current = status === 'active';

    return () => {
      if (unlockTimelineRef.current) {
        unlockTimelineRef.current.kill();
        unlockTimelineRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    if (!isOpening) return;

    const tl = createGiftOpenTimeline(
      {
        box: boxRef.current,
        lid: lidRef.current,
        ribbon: ribbonRef.current,
        glow: glowRef.current,
        particles: particlesRef.current,
      },
      {
        onRevealComplete: () => onOpenAnimationComplete(index),
      }
    );

    openTimelineRef.current = tl;

    return () => {
      tl.kill();
      openTimelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpening]);

  useEffect(() => {
    return () => {
      if (hoverTweenRef.current) hoverTweenRef.current.kill();
      if (openTimelineRef.current) openTimelineRef.current.kill();
      if (unlockTimelineRef.current) unlockTimelineRef.current.kill();
    };
  }, []);

  const handleEnter = () => {
    if (status !== 'active' || isOpening) return;
    hoverTweenRef.current = gsap.to(boxRef.current, {
      y: GIFT_HOVER_LIFT,
      duration: GIFT_HOVER_DURATION,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    if (status !== 'active' || isOpening) return;
    hoverTweenRef.current = gsap.to(boxRef.current, {
      y: 0,
      duration: GIFT_HOVER_DURATION,
      ease: 'power2.out',
    });
  };

  const handleActivate = () => {
    if (status !== 'active' || isOpening) return;
    onOpen(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActivate();
    }
  };

  const isInteractive = status === 'active' && !isOpening;

  return (
    <div ref={rootRef} className={styles.giftRoot} data-gift-item data-status={status}>
      <div
        ref={boxRef}
        className={styles.box}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        aria-disabled={!isInteractive}
        aria-label={`Gift ${index + 1}${
          status === 'opened' ? ', opened' : status === 'active' ? ', tap to open' : ', locked'
        }`}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div ref={glowRef} className={styles.glow} />
        <div className={styles.boxBody}>
          <span className={styles.boxNumber}>{index + 1}</span>
        </div>
        <div ref={lidRef} className={styles.lid} />
        <div ref={ribbonRef} className={styles.ribbon} />
        <div ref={particlesRef} className={styles.particles}>
          {particles.map((p, i) => (
            <span
              key={i}
              data-gift-particle
              className={styles.particle}
              style={{ left: `${p.left}%`, top: `${p.top}%` }}
            />
          ))}
        </div>
      </div>
      {status === 'locked' && <div className={styles.lockOverlay} aria-hidden="true" />}
    </div>
  );
};

export default GiftBox;