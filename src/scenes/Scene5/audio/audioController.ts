import gsap from 'gsap';
import type { Scene5AudioConfig } from './audioConfig';

/**
 * Reusable, framework-agnostic controller around a single
 * HTMLAudioElement, following the same shape and conventions as
 * Scene 4's AudioController.
 *
 * Fade-in is triggered by playback actually starting (the play()
 * promise resolving), not by a fixed timer — same reasoning as
 * Scene 4's controller. If play() is rejected (browser autoplay
 * policy), a one-shot listener is armed for the next interaction
 * anywhere on the page, which retries; once it succeeds, fade-in
 * runs then.
 */
export class AudioController {
  private readonly config: Scene5AudioConfig;

  private audio: HTMLAudioElement | null = null;
  private fadeTween: gsap.core.Tween | null = null;
  private unlockHandler: (() => void) | null = null;
  private destroyed = false;
  private mutedVolume: number | null = null;
  // Bumped by stop()/fadeOut() to invalidate any play() promise that
  // was already in flight when teardown began -- see Scene 4's
  // AudioController for the full explanation (a stale resolution
  // otherwise revives playback via fadeIn() on a controller nothing
  // will ever stop again).
  private generation = 0;

  constructor(config: Scene5AudioConfig) {
    this.config = config;

    if (typeof window === 'undefined') return;

    const audio = new Audio(config.src);
    audio.loop = config.loop;
    audio.preload = config.preload;
    audio.playbackRate = config.playbackRate;
    audio.volume = Math.min(1, Math.max(0, config.initialVolume));
    this.audio = audio;
  }

  private armUnlockListener(retry: () => void): void {
    if (this.unlockHandler || typeof window === 'undefined') return;

    const handler = () => {
      this.disarmUnlockListener();
      retry();
    };

    this.unlockHandler = handler;
    window.addEventListener('pointerdown', handler);
    window.addEventListener('keydown', handler);
    window.addEventListener('touchstart', handler);
  }

  private disarmUnlockListener(): void {
    const handler = this.unlockHandler;
    if (!handler || typeof window === 'undefined') return;
    window.removeEventListener('pointerdown', handler);
    window.removeEventListener('keydown', handler);
    window.removeEventListener('touchstart', handler);
    this.unlockHandler = null;
  }

  /** Starts playback only (no volume change). Idempotent — does
   * nothing if already playing or destroyed. Recovers from a
   * rejected play() by retrying on the next user gesture. */
  play(): void {
    const audio = this.audio;
    if (!audio || this.destroyed || !audio.paused) return;

    const generation = this.generation;
    audio.play().catch((err) => {
      console.warn(`[AudioController] play() blocked for "${this.config.src}":`, err);
      if (this.destroyed || generation !== this.generation) return;
      this.armUnlockListener(() => this.play());
    });
  }

  /** Starts playback, then fades from the current volume up to
   * targetVolume once playback has actually begun. Recovers from a
   * rejected play() the same way as play(). */
  playAndFadeIn(targetVolume: number, durationMs: number): void {
    const audio = this.audio;
    if (!audio || this.destroyed) return;

    if (!audio.paused) {
      this.fadeIn(targetVolume, durationMs);
      return;
    }

    const generation = this.generation;
    audio
      .play()
      .then(() => {
        if (this.destroyed || generation !== this.generation) return;
        this.fadeIn(targetVolume, durationMs);
      })
      .catch((err) => {
        console.warn(`[AudioController] play() blocked for "${this.config.src}":`, err);
        if (this.destroyed || generation !== this.generation) return;
        this.armUnlockListener(() => this.playAndFadeIn(targetVolume, durationMs));
      });
  }

  pause(): void {
    this.audio?.pause();
  }

  /** Stops playback and resets position, cancelling any in-flight
   * fade and pending unlock retry. Does not release the element —
   * use destroy() for full teardown. */
  stop(): void {
    this.generation += 1;
    this.disarmUnlockListener();
    if (this.fadeTween) {
      this.fadeTween.kill();
      this.fadeTween = null;
    }

    const audio = this.audio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /** Stops and restarts playback from the beginning at the current
   * volume. */
  restart(): void {
    const audio = this.audio;
    if (!audio || this.destroyed) return;

    this.stop();
    this.play();
  }

  /** Sets the playback position, in seconds. Clamped to the track's
   * duration once known; if duration isn't available yet (metadata
   * not loaded), the browser clamps on assignment. */
  seek(timeSeconds: number): void {
    const audio = this.audio;
    if (!audio || this.destroyed) return;
    audio.currentTime = Math.max(0, timeSeconds);
  }

  /** Fades the current volume to targetVolume over durationMs. Does
   * not start or stop playback. */
  fadeIn(targetVolume: number, durationMs: number): void {
    const audio = this.audio;
    if (!audio || this.destroyed) return;

    if (this.fadeTween) this.fadeTween.kill();
    this.fadeTween = gsap.to(audio, {
      volume: Math.min(1, Math.max(0, targetVolume)),
      duration: durationMs / 1000,
      ease: 'power1.inOut',
    });
  }

  /** Fades the current volume down to 0 over durationMs, then pauses
   * and resets position. If playback never actually started, skips
   * the pointless fade and stops immediately. */
  fadeOut(durationMs: number, onComplete?: () => void): void {
    this.generation += 1;
    this.disarmUnlockListener();

    const audio = this.audio;
    if (!audio) {
      onComplete?.();
      return;
    }

    if (this.fadeTween) this.fadeTween.kill();

    if (audio.paused) {
      audio.currentTime = 0;
      onComplete?.();
      return;
    }

    this.fadeTween = gsap.to(audio, {
      volume: 0,
      duration: durationMs / 1000,
      ease: 'power1.inOut',
      onComplete: () => {
        audio.pause();
        audio.currentTime = 0;
        onComplete?.();
      },
    });
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.min(1, Math.max(0, volume));
    }
  }

  getVolume(): number {
    return this.audio?.volume ?? 0;
  }

  mute(): void {
    const audio = this.audio;
    if (!audio || audio.muted) return;
    this.mutedVolume = audio.volume;
    audio.muted = true;
  }

  unmute(): void {
    const audio = this.audio;
    if (!audio || !audio.muted) return;
    audio.muted = false;
    if (this.mutedVolume !== null) {
      audio.volume = this.mutedVolume;
      this.mutedVolume = null;
    }
  }

  /** Cancels tweens and the unlock listener without releasing the
   * audio element. Called internally by destroy(); also safe to call
   * directly if a lighter-weight reset is ever needed. */
  cleanup(): void {
    this.disarmUnlockListener();
    if (this.fadeTween) {
      this.fadeTween.kill();
      this.fadeTween = null;
    }
  }

  /** Full teardown: cleanup(), stop playback, release the audio
   * element. Safe to call more than once. */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    this.cleanup();

    const audio = this.audio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.audio = null;
  }
}