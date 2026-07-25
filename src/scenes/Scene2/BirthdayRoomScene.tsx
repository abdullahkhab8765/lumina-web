'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import RoomBackground from './components/RoomBackground';
import FloatingParticles from './components/FloatingParticles';
import AmbientGlow from './components/AmbientGlow';
import ContinueButton from './components/ContinueButton';
import useSceneAudio from './hooks/useSceneAudio';
import styles from './BirthdayRoomScene.module.css';
import {
  SCENE2_FADE_IN_DURATION,
  SCENE2_EXIT_DURATION,
  GLOW_INTENSITY,
  CONTINUE_BUTTON_DELAY,
} from './utils/scene2.constants';

interface BirthdayRoomSceneProps {
  isActive: boolean;
  onComplete: () => void;
}

// Layer 1 (main): cinematic piano, full presence, starts immediately.
const PIANO_SRC = '/audio/scene2-piano.mp3';
// Layer 2: Happy Birthday, subtle background vocals, fades in ~2s later.
const HAPPY_BIRTHDAY_SRC = '/audio/happy-birthday.mp3';

const PIANO_TARGET_VOLUME = 1;
const PIANO_FADE_IN_DURATION = 1.4;

const VOCALS_TARGET_VOLUME = 0.25;
const VOCALS_FADE_IN_DURATION = 2;
const VOCALS_START_DELAY = 2;

const BirthdayRoomScene: React.FC<BirthdayRoomSceneProps> = ({ isActive, onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [continueVisible, setContinueVisible] = useState(false);

  const {
    play: playPiano,
    fadeOutAndStop: fadeOutPiano,
    stopImmediately: stopPianoImmediately,
  } = useSceneAudio(PIANO_SRC, isActive, {
    targetVolume: PIANO_TARGET_VOLUME,
    fadeInDuration: PIANO_FADE_IN_DURATION,
  });

  const {
    play: playVocals,
    fadeOutAndStop: fadeOutVocals,
    stopImmediately: stopVocalsImmediately,
  } = useSceneAudio(HAPPY_BIRTHDAY_SRC, isActive, {
    targetVolume: VOCALS_TARGET_VOLUME,
    fadeInDuration: VOCALS_FADE_IN_DURATION,
    startDelay: VOCALS_START_DELAY,
  });

  const cleanupTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    setContinueVisible(false);

    // Both calls happen synchronously here, as close as possible to
    // the user gesture that triggered this scene (Scene 1's Continue
    // click). Piano starts immediately; vocals internally waits out
    // its startDelay before starting and fading in. Neither track's
    // volume is audible until its own fade-in tween runs, so calling
    // both here doesn't change the audible cinematic timing.
    playPiano();
    playVocals();

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    timelineRef.current = tl;

    tl.set(container, { autoAlpha: 0 });
    tl.to(container, {
      autoAlpha: 1,
      duration: SCENE2_FADE_IN_DURATION,
      ease: 'power1.inOut',
    });

    tl.call(() => {
      setContinueVisible(true);
    }, undefined, `+=${CONTINUE_BUTTON_DELAY}`);

    return () => {
      cleanupTimeline();
      stopPianoImmediately();
      stopVocalsImmediately();
    };
  }, [isActive, playPiano, playVocals, stopPianoImmediately, stopVocalsImmediately, cleanupTimeline]);

  const handleContinue = useCallback(() => {
    const container = containerRef.current;

    const exitTl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Both tracks fade out together, in sync, over the same duration.
    fadeOutPiano();
    fadeOutVocals();

    if (container) {
      exitTl.to(container, {
        autoAlpha: 0,
        duration: SCENE2_EXIT_DURATION,
        ease: 'power1.inOut',
      });
    }
  }, [fadeOutPiano, fadeOutVocals, onComplete]);

  useEffect(() => {
    return () => {
      cleanupTimeline();
      stopPianoImmediately();
      stopVocalsImmediately();
    };
  }, [cleanupTimeline, stopPianoImmediately, stopVocalsImmediately]);

  if (!isActive) return null;

  return (
    <div ref={containerRef} className={styles.sceneRoot}>
      <RoomBackground />
      <FloatingParticles />
      <AmbientGlow intensity={GLOW_INTENSITY} />
      <div className={styles.continueWrapper}>
        <ContinueButton visible={continueVisible} onClick={handleContinue} />
      </div>
    </div>
  );
};

export default BirthdayRoomScene;