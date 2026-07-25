import gsap from 'gsap';
import type { RefObject } from 'react';
import {
  SCENE5_FADE_IN_DURATION,
  SCENE5_FADE_OUT_DURATION,
  SCENE5_TO_SCENE6_TRANSITION_DURATION,
  CAMERA_DRIFT_DURATION,
  CAMERA_DRIFT_X_PERCENT,
  CAMERA_DRIFT_Y_PERCENT,
  CAMERA_ZOOM_FROM,
  CAMERA_ZOOM_TO,
  FINALE_AUDIO_QUIET_VOLUME,
  FINALE_AUDIO_BUILD_VOLUME,
  FINALE_AUDIO_PEAK_VOLUME,
} from '../config/scene5Config';
import {
  BLESSING_LINES,
  FINAL_MESSAGE_LINES,
  TITLE_REVEAL_DURATION,
  TITLE_NAME_REVEAL_DURATION,
  BLESSING_LINE_DURATION,
  BLESSING_LINE_STAGGER,
  FINAL_MESSAGE_LINE_DURATION,
  FINAL_MESSAGE_LINE_STAGGER,
} from '../config/typographyConfig';
import { getEarliestFinaleDelay, getShowEndTime } from '../utils/choreography';
import { EASE_GENTLE, EASE_SOFT_OUT, EASE_SOFT_IN_OUT } from '../utils/easing';
import type { FireworksHandle } from '../hooks/useFireworks';
import type { FinaleAudioHandle } from '../hooks/useFinaleAudio';
import type { ParticlesHandle } from '../hooks/useParticles';
import type { BirthdayTitleHandle } from '../components/Typography/BirthdayTitle';
import type { BlessingTextHandle } from '../components/Typography/BlessingText';
import type { FinalMessageHandle } from '../components/Typography/FinalMessage';

export interface Scene5TimelineRefs {
  root: RefObject<HTMLDivElement | null>;
  camera: RefObject<HTMLDivElement | null>;
  title: RefObject<BirthdayTitleHandle | null>;
  blessing: RefObject<BlessingTextHandle | null>;
  finalMessage: RefObject<FinalMessageHandle | null>;
  fadeToBlack: RefObject<HTMLDivElement | null>;
}

export function createScene5Timeline(
  refs: Scene5TimelineRefs,
  fireworks: FireworksHandle,
  audio: FinaleAudioHandle,
  particles: ParticlesHandle,
  onComplete: () => void
): gsap.core.Timeline {
  const root = refs.root.current;
  const camera = refs.camera.current;
  const titleHandle = refs.title.current;
  const blessingHandle = refs.blessing.current;
  const finalMessageHandle = refs.finalMessage.current;
  const fadeToBlack = refs.fadeToBlack.current;

  const master = gsap.timeline({
    defaults: { ease: EASE_SOFT_IN_OUT },
    onComplete: () => onComplete(),
  });

  // --- Fade in / silence ---
  if (root) {
    master.set(root, { autoAlpha: 0 });
    master.to(root, { autoAlpha: 1, duration: SCENE5_FADE_IN_DURATION }, 'sceneStart');
  }

  master.addLabel('silence', 'sceneStart+=0.4');
  master.call(() => audio.play(), undefined, 'silence');

  // --- Camera: near-invisible drift + tiny zoom across the whole finale ---
  if (camera) {
    master.set(
      camera,
      { scale: CAMERA_ZOOM_FROM, xPercent: 0, yPercent: 0, transformOrigin: '50% 45%', force3D: true },
      'sceneStart'
    );
    master.to(
      camera,
      {
        scale: CAMERA_ZOOM_TO,
        xPercent: CAMERA_DRIFT_X_PERCENT,
        yPercent: CAMERA_DRIFT_Y_PERCENT,
        duration: CAMERA_DRIFT_DURATION,
        ease: EASE_GENTLE,
      },
      'sceneStart'
    );
  }

  // --- Ambient particles fade in gently alongside the sky ---
  const particlesFadeTween = particles.fadeIn(SCENE5_FADE_IN_DURATION * 1.4);
  if (particlesFadeTween) {
    master.add(particlesFadeTween, 'silence');
  }

  // --- Fireworks: first golden burst begins the "small celebration" ---
  master.addLabel('fireworksStart', 'silence+=2.8');
  const fireworksTl = fireworks.buildSequenceTimeline();
  master.add(fireworksTl, 'fireworksStart');

  // --- Music build: swells as the show escalates toward the grand finale ---
  const finaleDelay = getEarliestFinaleDelay();
  master.call(() => audio.swellTo(FINALE_AUDIO_BUILD_VOLUME, 6), undefined, `fireworksStart+=${Math.max(finaleDelay - 8, 4)}`);
  master.call(() => audio.swellTo(FINALE_AUDIO_PEAK_VOLUME, 2), undefined, `fireworksStart+=${finaleDelay}`);

  // --- Fireworks calm down, music settles ---
  const showEnd = getShowEndTime();
  master.call(() => audio.swellTo(FINALE_AUDIO_QUIET_VOLUME, 4), undefined, `fireworksStart+=${showEnd}`);

  // --- Typography: title reveal ---
  master.addLabel('titleReveal', `fireworksStart+=${showEnd + 2.5}`);
  if (titleHandle?.line1) {
    master.fromTo(
      titleHandle.line1,
      { autoAlpha: 0, y: 16, letterSpacing: '0.9em' },
      { autoAlpha: 1, y: 0, letterSpacing: '0.5em', duration: TITLE_REVEAL_DURATION, ease: EASE_SOFT_OUT },
      'titleReveal'
    );
  }
  if (titleHandle?.line2) {
    master.fromTo(
      titleHandle.line2,
      { autoAlpha: 0, y: 26, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: TITLE_NAME_REVEAL_DURATION, ease: EASE_SOFT_OUT },
      'titleReveal+=0.5'
    );
  }

  // --- Blessing, line by line ---
  master.addLabel('blessingReveal', 'titleReveal+=4.5');
  if (blessingHandle) {
    const lines = blessingHandle.lines;
    lines.forEach((line, index) => {
      master.fromTo(
        line,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: BLESSING_LINE_DURATION, ease: EASE_SOFT_OUT },
        `blessingReveal+=${index * BLESSING_LINE_STAGGER}`
      );
    });

    if (lines.length) {
      const blessingHoldStart = `blessingReveal+=${lines.length * BLESSING_LINE_STAGGER + 0.6}`;
      master.to(lines, { autoAlpha: 0, y: -10, duration: 1, ease: EASE_SOFT_IN_OUT, stagger: 0.08 }, blessingHoldStart);
    }
  }

  // --- Title fades as the blessing gives way to the final message ---
  if (titleHandle?.line1 && titleHandle?.line2) {
    master.to([titleHandle.line1, titleHandle.line2], { autoAlpha: 0, duration: 1.2, ease: EASE_SOFT_IN_OUT }, 'blessingReveal+=1');
  }

  // --- Final heartfelt message — anchored directly to the blessing's own
  // reveal completion (not to its fade-out tween), so it begins shortly
  // after the blessing has had time to be read, while the blessing is
  // still visible/mid-fade. This intentional overlap keeps the emotional
  // momentum continuous instead of waiting for the blessing to fully clear.
  const blessingRevealSpan = BLESSING_LINES.length * BLESSING_LINE_STAGGER;
  master.addLabel('finalMessage', `blessingReveal+=${blessingRevealSpan + 0.8}`);
  if (finalMessageHandle) {
    finalMessageHandle.lines.forEach((line, index) => {
      master.fromTo(
        line,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: FINAL_MESSAGE_LINE_DURATION, ease: EASE_SOFT_OUT },
        `finalMessage+=${index * FINAL_MESSAGE_LINE_STAGGER}`
      );
    });
  }

  // --- Everything fades, music ends, scene closes ---
  // Anchored to the final message's own reveal completion (label +
  // however long its lines take to fully stagger in), not a leftover
  // sequential offset — so this stays correct regardless of upstream
  // timeline changes. Holds ~5s once fully readable, then transitions.
  const finalMessageRevealSpan =
    (FINAL_MESSAGE_LINES.length - 1) * FINAL_MESSAGE_LINE_STAGGER + FINAL_MESSAGE_LINE_DURATION;
  master.addLabel('closing', `finalMessage+=${finalMessageRevealSpan + 5}`);
  master.call(() => audio.fadeOutAndStop(), undefined, 'closing');

  // Scene 5's own visual fade-out happens first, while the quote's hold
  // has just ended -- this is "Scene 5 begins fade out".
  if (root) {
    master.to(root, { autoAlpha: 0, duration: SCENE5_FADE_OUT_DURATION, ease: EASE_SOFT_IN_OUT }, 'closing');
  }

  // The white/black cover transition overlaps the tail end of Scene 5's
  // own fade-out (rather than starting only once it's fully finished):
  // by the last ~0.6s of a 2.4s fade-out, root is already nearly
  // invisible against the app's black background, so covering it early
  // is visually seamless -- and it means the cover finishes exactly
  // when the fade-out does, instead of 0.6s afterward. That 0.6s is
  // real, measurable wait time removed, not another arbitrary duration
  // tweak: the master timeline's total length is set by whichever tween
  // ends last, and now that's the fade-out itself. Scene 6 mounts (via
  // the master's onComplete below) the instant it finishes; nothing
  // after this point adds further delay.
  master.addLabel('transition', `closing+=${SCENE5_FADE_OUT_DURATION - SCENE5_TO_SCENE6_TRANSITION_DURATION}`);
  if (fadeToBlack) {
    master.set(fadeToBlack, { pointerEvents: 'auto' }, 'transition');
    master.to(
      fadeToBlack,
      { opacity: 1, duration: SCENE5_TO_SCENE6_TRANSITION_DURATION, ease: EASE_SOFT_IN_OUT },
      'transition'
    );
  }

  return master;
}