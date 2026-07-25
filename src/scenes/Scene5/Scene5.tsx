'use client';

import React, { useRef } from 'react';
import NightGradient from './components/Background/NightGradient';
import Stars from './components/Background/Stars';
import Clouds from './components/Background/Clouds';
import CameraRig from './components/Camera/CameraRig';
import FinaleSky from './components/FinaleSky/FinaleSky';
import Fireworks from './components/Fireworks/Fireworks';
import AmbientGlow from './components/Lighting/AmbientGlow';
import FireworkFlash from './components/Lighting/FireworkFlash';
import GoldenDust from './components/Particles/GoldenDust';
import Embers from './components/Particles/Embers';
import Bokeh from './components/Particles/Bokeh';
import FloatingGlow from './components/Particles/FloatingGlow';
import BirthdayTitle, { type BirthdayTitleHandle } from './components/Typography/BirthdayTitle';
import BlessingText, { type BlessingTextHandle } from './components/Typography/BlessingText';
import FinalMessage, { type FinalMessageHandle } from './components/Typography/FinalMessage';
import FadeToBlack from './components/Ending/FadeToBlack';
import useFireworks, { type FireworksHandle } from './hooks/useFireworks';
import useFinaleAudio from './hooks/useFinaleAudio';
import useParticles from './hooks/useParticles';
import useScene5Timeline from './hooks/useScene5Timeline';
import styles from './Scene5.module.css';

interface Scene5Props {
  isActive: boolean;
  onComplete: () => void;
}

const Scene5: React.FC<Scene5Props> = ({ isActive, onComplete }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const particlesWrapperRef = useRef<HTMLDivElement | null>(null);
  const fireworkFlashRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<BirthdayTitleHandle | null>(null);
  const blessingRef = useRef<BlessingTextHandle | null>(null);
  const finalMessageRef = useRef<FinalMessageHandle | null>(null);
  const fadeToBlackRef = useRef<HTMLDivElement | null>(null);
  const fireworksApiRef = useRef<FireworksHandle | null>(null);

  const audio = useFinaleAudio({ active: isActive });
  const particles = useParticles(particlesWrapperRef);

  useScene5Timeline({
    isActive,
    refs: {
      root: rootRef,
      camera: cameraRef,
      title: titleRef,
      blessing: blessingRef,
      finalMessage: finalMessageRef,
      fadeToBlack: fadeToBlackRef,
    },
    fireworksRef: fireworksApiRef,
    audio,
    particles,
    onComplete,
  });

  if (!isActive) return null;

  return (
    <div ref={rootRef} className={styles.sceneRoot}>
      <NightGradient />
      <Stars />
      <Clouds />
      <AmbientGlow />

      <CameraRig ref={cameraRef}>
        <FinaleSky>
          <Fireworks ref={fireworksApiRef} lightingRef={fireworkFlashRef} />
        </FinaleSky>

        <BirthdayTitle ref={titleRef} />
        <BlessingText ref={blessingRef} />
        <FinalMessage ref={finalMessageRef} />
      </CameraRig>

      <div ref={particlesWrapperRef} className={styles.particlesWrapper}>
        <GoldenDust />
        <Embers />
        <Bokeh />
        <FloatingGlow />
      </div>

      <FireworkFlash ref={fireworkFlashRef} />
      <FadeToBlack ref={fadeToBlackRef} />
    </div>
  );
};

export default Scene5;