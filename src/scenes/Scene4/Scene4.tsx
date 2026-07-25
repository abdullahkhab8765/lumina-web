'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Background from './components/Background/Background';
import SceneOverlay from './components/SceneOverlay/SceneOverlay';
import AmbientParticles from './components/AmbientParticles/AmbientParticles';
import LightRays from './components/LightRays/LightRays';
import CameraLayer from './components/CameraLayer/CameraLayer';
import LuxuryLetter from './components/LuxuryLetter/LuxuryLetter';
import LetterHeader from './components/LetterHeader/LetterHeader';
import ParagraphReveal, { type ParagraphRevealHandle } from './components/ParagraphReveal/ParagraphReveal';
import ContinuePrompt from './components/ContinuePrompt/ContinuePrompt';
import EndingGlow from './components/EndingGlow/EndingGlow';
import useScene4 from './hooks/useScene4';
import useLetterAnimation from './hooks/useLetterAnimation';
import useParagraphFlow from './hooks/useParagraphFlow';
import useScene4Audio, { type Scene4Paragraph } from './audio/useScene4Audio';
import { letterContent } from './data/letterContent';
import {
  PAPER_ENTRANCE_DURATION,
  HEADER_REVEAL_DELAY,
  HEADER_REVEAL_DURATION,
  SCENE4_EXIT_DURATION,
} from './constants/scene4';
import { EASE_SOFT_IN_OUT } from './utils/easing';
import styles from './Scene4.module.css';

interface Scene4Props {
  isActive: boolean;
  onComplete: () => void;
}

const FIRST_PARAGRAPH_DELAY = PAPER_ENTRANCE_DURATION + HEADER_REVEAL_DELAY + HEADER_REVEAL_DURATION;

const Scene4: React.FC<Scene4Props> = ({ isActive, onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<ParagraphRevealHandle | null>(null);

  const { setParagraphVolume, fadeOutAndStop } = useScene4Audio(isActive);

  // Fades Scene4's own root to invisible before handing off to
  // SceneManager. Without this, React unmounts the still-fully-opaque
  // letter card in the same tick Scene5 mounts, producing a visible flash
  // (Scene5's root is correctly invisible on mount via CSS, so it isn't
  // the source -- Scene4 vanishing at full opacity is). Mirrors the exit
  // pattern already used by Scene2's BirthdayRoomScene.
  //
  // The real onComplete() (which swaps SceneManager over to Scene5,
  // mounting it and starting its music) is deferred until Scene4's own
  // music has fully faded out, paused, and been destroyed -- not just
  // until the visual fade finishes. Otherwise Scene5's audio would start
  // while Scene4's audio was still mid-fade, and the two would overlap.
  const handleSceneComplete = useCallback(() => {
    const container = containerRef.current;

    if (container) {
      gsap.to(container, {
        autoAlpha: 0,
        duration: SCENE4_EXIT_DURATION,
        ease: EASE_SOFT_IN_OUT,
      });
    }

    fadeOutAndStop(() => {
      onComplete();
    });
  }, [onComplete, fadeOutAndStop]);

  const { activeIndex, currentParagraph, isLast, isRevealed, markRevealed, advance } =
    useParagraphFlow(handleSceneComplete);

  useScene4(isActive, {
    container: containerRef,
    overlay: overlayRef,
    camera: cameraRef,
  });

  useLetterAnimation(isActive, { paper: paperRef });

  useEffect(() => {
    if (!isActive) return;
    setParagraphVolume(currentParagraph.id as Scene4Paragraph);
  }, [isActive, currentParagraph.id, setParagraphVolume]);

  const handleContinueClick = useCallback(() => {
    if (isLast) {
      advance();
      return;
    }

    paragraphRef.current?.playExit(() => {
      advance();
    });
  }, [isLast, advance]);

  if (!isActive) return null;

  return (
    <div ref={containerRef} className={styles.sceneRoot}>
      <Background />
      <SceneOverlay ref={overlayRef} />
      <AmbientParticles />
      <LightRays />

      <EndingGlow active={isRevealed && isLast} />

      <CameraLayer ref={cameraRef}>
        <LuxuryLetter ref={paperRef}>
          <LetterHeader heading={letterContent.heading} />

          <ParagraphReveal
            ref={paragraphRef}
            key={currentParagraph.id}
            paragraphId={currentParagraph.id}
            text={currentParagraph.text}
            startDelay={activeIndex === 0 ? FIRST_PARAGRAPH_DELAY : 0}
            onRevealComplete={markRevealed}
          />

          {isRevealed && <ContinuePrompt onContinue={handleContinueClick} />}
        </LuxuryLetter>
      </CameraLayer>
    </div>
  );
};

export default Scene4;