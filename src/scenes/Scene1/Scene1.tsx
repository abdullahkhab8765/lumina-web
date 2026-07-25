"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createScene1Timeline, Scene1TimelineTargets } from "@/components/animations/scene1Timeline";
import CinematicText from "@/components/CinematicText/CinematicText";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import Countdown, { CountdownHandle } from "@/components/Countdown/Countdown";
import BirthdayTitle from "@/components/BirthdayTitle/BirthdayTitle";
import Fireworks, { FireworksHandle } from "@/components/Fireworks/Fireworks";
import FlashTransition, { FlashTransitionHandle } from "@/components/FlashTransition/FlashTransition";
import ContinueButton from "@/components/ContinueButton/ContinueButton";
import useScene1Audio from "./hooks/useScene1Audio";
import styles from "./Scene1.module.css";

interface FloatingParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

const FLOATING_PARTICLE_COUNT = 22;

function buildFloatingParticles(): FloatingParticle[] {
  return Array.from({ length: FLOATING_PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 7 + Math.random() * 8,
    delay: Math.random() * 6,
  }));
}

/**
 * Master controller for Scene 1. Owns the single GSAP timeline that
 * sequences every child: black screen -> cinematic text -> loading bar ->
 * countdown -> white flash -> fireworks -> title reveal -> glow particles
 * -> Continue button. Children never animate themselves; they only expose
 * refs/imperative handles that this component drives.
 *
 * Audio: background theme starts on the first countdown tick and fades
 * in; fireworks sfx plays once when fireworks begin; the theme fades out
 * and stops automatically when this component unmounts (which, in this
 * architecture, only happens when the user clicks Continue and
 * SceneManager swaps to Scene 2).
 */
export default function Scene1() {
  const blackScreenRef = useRef<HTMLDivElement | null>(null);
  const cinematicTextRef = useRef<HTMLParagraphElement | null>(null);
  const loadingBarRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<CountdownHandle | null>(null);
  const flashRef = useRef<FlashTransitionHandle | null>(null);
  const fireworksRef = useRef<FireworksHandle | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const glowParticlesRef = useRef<HTMLDivElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);

  const { startTheme, playFireworksSfx } = useScene1Audio();
  const themeStartedRef = useRef(false);

  // Generated client-side only: Math.random() during render would produce
  // a different particle field on the server-rendered/hydrating pass than
  // on subsequent client renders, causing a hydration mismatch. Starting
  // from an empty array and filling it in an effect keeps the first paint
  // identical on both passes.
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setFloatingParticles(buildFloatingParticles());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets: Scene1TimelineTargets = {
        blackScreen: blackScreenRef.current,
        cinematicText: cinematicTextRef.current,
        loadingBar: loadingBarRef.current,
        countdownNumber: countdownRef.current?.element ?? null,
        flash: flashRef.current?.element ?? null,
        fireworksLayer: fireworksRef.current?.element ?? null,
        title: titleRef.current,
        glowParticles: glowParticlesRef.current,
        continueButton: continueButtonRef.current,
      };

      const timeline = createScene1Timeline(
        targets,
        {
          onCountdownTick: (value) => {
            countdownRef.current?.setValue(value);
            if (!themeStartedRef.current) {
              themeStartedRef.current = true;
              startTheme();
            }
          },
          onFireworksStart: () => {
            fireworksRef.current?.start();
            playFireworksSfx();
          },
        },
        { reducedMotion }
      );

      timeline.play();
    });

    return () => {
      fireworksRef.current?.stop();
      ctx.revert();
    };
  }, [startTheme, playFireworksSfx]);

  return (
    <section className={styles.root} aria-label="Intro">
      <div ref={blackScreenRef} className={styles.blackScreen} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.floatingParticlesLayer} aria-hidden="true">
        {floatingParticles.map((p) => (
          <span
            key={p.id}
            className={styles.floatingParticle}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.centerStage}>
        <CinematicText ref={cinematicTextRef} />
        <LoadingBar ref={loadingBarRef} />
        <Countdown ref={countdownRef} />
      </div>

      <FlashTransition ref={flashRef} />

      <div className={styles.fireworksLayer}>
        <Fireworks ref={fireworksRef} />
      </div>

      <div ref={glowParticlesRef} className={styles.glowParticles} aria-hidden="true" />

      <div className={styles.centerStage}>
        <BirthdayTitle ref={titleRef} />
      </div>

      <ContinueButton ref={continueButtonRef} targetScene={2} />
    </section>
  );
}