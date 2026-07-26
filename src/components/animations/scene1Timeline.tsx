import gsap from "gsap";
import { initGsap } from "@/lib/gsap";
import {
  LOADING_DURATION,
  COUNTDOWN_STEPS,
  DEFAULT_EASE,
  DEFAULT_EASE_IN,
  DEFAULT_EASE_INOUT,
  DEFAULT_EASE_BACK,
} from "@/lib/constants";

/**
 * DOM/ref targets the Scene 1 master timeline animates.
 * All targets are optional at the GSAP level (null targets are silently
 * skipped, see `lib/gsap.ts` -> `nullTargetWarn: false`), so a caller can
 * omit a stage that isn't mounted yet without breaking the sequence.
 */
export interface Scene1TimelineTargets {
  /** Full-bleed black backdrop shown before anything else. */
  blackScreen: gsap.TweenTarget;
  /** CinematicText's root element (e.g. "Preparing Something Special..."). */
  cinematicText: gsap.TweenTarget;
  /** Fill element of the loading bar, animated 0% -> 100% width. */
  loadingBar: gsap.TweenTarget;
  /** Outer track/pill element of the loading bar, faded out alongside the cinematic text. */
  loadingBarTrack: gsap.TweenTarget;
  /** Countdown's root element, whose text content the caller swaps via a callback. */
  countdownNumber: gsap.TweenTarget;
  /** FlashTransition's root element. */
  flash: gsap.TweenTarget;
  /** Fireworks wrapper element, faded/scaled in as fireworks begin. */
  fireworksLayer: gsap.TweenTarget;
  /** BirthdayTitle's root element. */
  title: gsap.TweenTarget;
  /** Ambient glow / particle layer behind the title. */
  glowParticles: gsap.TweenTarget;
  /** ContinueButton's root element, revealed last. */
  continueButton: gsap.TweenTarget;
}

/** Lifecycle hooks the caller (Scene1.tsx) uses to sync React state with the timeline. */
export interface Scene1TimelineCallbacks {
  /** Fired once per countdown step, with the number about to be displayed (3, 2, 1). */
  onCountdownTick?: (value: number) => void;
  /** Fired once the flash has mostly faded, when fireworks should start rendering. */
  onFireworksStart?: () => void;
  /** Fired when the title has fully revealed and glow particles are active. */
  onTitleRevealed?: () => void;
  /** Fired when the entire Scene 1 sequence has finished (Continue button visible). */
  onComplete?: () => void;
}

export interface Scene1TimelineOptions {
  /** Loading bar fill duration, in seconds. Defaults to the shared LOADING_DURATION constant. */
  loadingDuration?: number;
  /** Number of countdown steps (3, 2, 1 = 3 steps). Defaults to the shared COUNTDOWN_STEPS constant. */
  countdownSteps?: number;
  /** Duration of a single countdown step's scale/glow/fade cycle, in seconds. */
  countdownStepDuration?: number;
  /** If true, builds a near-instant timeline that still fires every callback, for prefers-reduced-motion. */
  reducedMotion?: boolean;
}

const DEFAULT_COUNTDOWN_STEP_DURATION = 0.95;
const LOADING_BAR_START_OFFSET = 0.5;

/**
 * Builds the Scene 1 master GSAP timeline: black screen -> cinematic text ->
 * loading bar -> countdown -> white flash -> fireworks -> title reveal ->
 * glow particles -> Continue button.
 *
 * The timeline is created paused; the caller is responsible for calling
 * `.play()` and for killing it on unmount (e.g. via `gsap.context` or
 * `timeline.kill()`), since this module holds no lifecycle of its own.
 */
export function createScene1Timeline(
  targets: Scene1TimelineTargets,
  callbacks: Scene1TimelineCallbacks = {},
  options: Scene1TimelineOptions = {}
): gsap.core.Timeline {
  initGsap();

  const {
    loadingDuration = LOADING_DURATION,
    countdownSteps = COUNTDOWN_STEPS,
    countdownStepDuration = DEFAULT_COUNTDOWN_STEP_DURATION,
    reducedMotion = false,
  } = options;

  const { onCountdownTick, onFireworksStart, onTitleRevealed, onComplete } = callbacks;

  const {
    blackScreen,
    cinematicText,
    loadingBar,
    loadingBarTrack,
    countdownNumber,
    flash,
    fireworksLayer,
    title,
    glowParticles,
    continueButton,
  } = targets;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: DEFAULT_EASE, overwrite: "auto" },
    onComplete: () => onComplete?.(),
  });

  if (reducedMotion) {
    gsap.set(
      [blackScreen, cinematicText, loadingBar, loadingBarTrack, flash, fireworksLayer, title, glowParticles, continueButton],
      { clearProps: "all" }
    );
    gsap.set(loadingBar, { width: "100%" });
    gsap.set(loadingBarTrack, { opacity: 0 });
    gsap.set(flash, { opacity: 0 });
    gsap.set([cinematicText, title, glowParticles, fireworksLayer], { opacity: 1 });
    gsap.set(continueButton, { pointerEvents: "auto" });

    tl.call(() => {
      for (let step = countdownSteps; step >= 1; step -= 1) {
        onCountdownTick?.(step);
      }
      onFireworksStart?.();
      onTitleRevealed?.();
    });
    tl.set(continueButton, { opacity: 1 });
    return tl;
  }

  // 1. Black screen
  tl.set(blackScreen, { opacity: 1 })
    .set([cinematicText, countdownNumber, flash, fireworksLayer, title, glowParticles, continueButton], {
      opacity: 0,
    })
    .set(loadingBar, { width: "0%" }, "<")
    .set(continueButton, { pointerEvents: "none" }, "<")
    .to(blackScreen, { opacity: 1, duration: 0.4 }, "sceneStart");

  // 2. Cinematic text reveal
  tl.fromTo(
    cinematicText,
    { opacity: 0, y: 14, filter: "blur(6px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: DEFAULT_EASE },
    "sceneStart+=0.2"
  );

  // 3. Loading bar — anchored to a label so the text fade-out below never
  // depends on re-deriving the same offset twice.
  tl.addLabel("loadingBarStart", `sceneStart+=${LOADING_BAR_START_OFFSET}`)
    .to(loadingBar, { width: "100%", duration: loadingDuration, ease: DEFAULT_EASE_INOUT }, "loadingBarStart")
    .addLabel("loadingBarComplete")
    .to(
      [cinematicText, loadingBarTrack],
      { opacity: 0, y: -10, filter: "blur(4px)", duration: 0.5, ease: DEFAULT_EASE_IN },
      `loadingBarStart+=${Math.max(loadingDuration - 0.4, 0)}`
    );

  // 4. Countdown (N -> 1) — explicitly anchored to the loading bar's own
  // completion label, not a fixed delay, so it can never start early.
  tl.addLabel("countdownStart", "loadingBarComplete");
  for (let step = countdownSteps; step >= 1; step -= 1) {
    const isFirstStep = step === countdownSteps;
    tl.call(() => onCountdownTick?.(step), undefined, isFirstStep ? "countdownStart" : undefined)
      .fromTo(
        countdownNumber,
        { opacity: 0, scale: 0.4, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1.28,
          filter: "blur(0px)",
          duration: countdownStepDuration * 0.42,
          ease: DEFAULT_EASE_BACK,
        }
      )
      .to(countdownNumber, {
        scale: 1,
        duration: countdownStepDuration * 0.26,
        ease: DEFAULT_EASE,
      })
      .to(countdownNumber, {
        opacity: 0,
        scale: 0.82,
        filter: "blur(6px)",
        duration: countdownStepDuration * 0.32,
        ease: DEFAULT_EASE_IN,
      });
  }

  // 5. White flash
  tl.addLabel("flashStart")
    .to(blackScreen, { opacity: 0, duration: 0.2, ease: DEFAULT_EASE_IN }, "flashStart")
    .to(flash, { opacity: 1, duration: 0.16, ease: DEFAULT_EASE_IN }, "flashStart")
    .to(flash, { opacity: 0, duration: 0.7, ease: DEFAULT_EASE }, "flashStart+=0.2");

  // 6. Fireworks — held back until the flash has mostly cleared so the
  // first bursts read against a settled backdrop instead of washed-out white.
  tl.call(() => onFireworksStart?.(), undefined, "flashStart+=0.5").fromTo(
    fireworksLayer,
    { opacity: 0, scale: 1.04 },
    { opacity: 1, scale: 1, duration: 1.1, ease: DEFAULT_EASE },
    "flashStart+=0.5"
  );

  // 7. Happy Birthday title — enters once fireworks are already established.
  tl.fromTo(
    title,
    { opacity: 0, y: 40, filter: "blur(10px)", letterSpacing: "0.5em" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      letterSpacing: "0.08em",
      duration: 1.1,
      ease: DEFAULT_EASE,
    },
    "flashStart+=0.85"
  );

  // 8. Glow particles
  tl.fromTo(
    glowParticles,
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 1.3, ease: DEFAULT_EASE_INOUT },
    "<+=0.2"
  ).call(() => onTitleRevealed?.());

  // 9. Continue button
  tl.fromTo(
    continueButton,
    { opacity: 0, y: 24, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: DEFAULT_EASE },
    "+=0.4"
  ).set(continueButton, { pointerEvents: "auto" });

  return tl;
}