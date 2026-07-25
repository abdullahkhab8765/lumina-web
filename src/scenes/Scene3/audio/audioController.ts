import gsap from 'gsap';
import type { Scene3AudioConfig } from './audioConfig';

/**
 * Reusable, framework-agnostic controller around a single
 * HTMLAudioElement. Owns its own GSAP volume/delay tweens and their
 * cleanup. Autoplay recovery: if a play() call is rejected (most
 * commonly one that happens asynchronously, disconnected from any
 * user gesture — e.g. after a scheduled delay), a one-shot listener
 * is armed for the next interaction anywhere on the page, which
 * retries. This mirrors the fix already proven for Scene 2's audio.
 */
export class AudioController {
  private readonly src: string;
  private readonly config: Scene3AudioConfig;

  private audio: HTMLAudioElement | null = null;
  private fadeTween: gsap.core.Tween | null = null;
  private delayedStart: gsap.core.Tween | null = null;
  private unlockHandler: (() => void) | null = null;
  private destroyed = false;

  constructor(src: string, config: Scene3AudioConfig) {
    this.src = src;
    this.config = config;

    if (typeof window === 'undefined') return;

    const audio = new Audio(src);
    audio.loop = config.loop;
    audio.preload = 'auto';
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

  /** Starts playback at the current volume. Idempotent — does
   * nothing if already playing or destroyed. */
  play(): void {
    const audio = this.audio;
    if (!audio || this.destroyed || !audio.paused) return;

    audio.play().catch((err) => {
      console.warn(`[AudioController] play() blocked for "${this.src}":`, err);
      if (this.destroyed) return;
      this.armUnlockListener(() => this.play());
    });
  }

  pause(): void {
    this.audio?.pause();
  }

  resume(): void {
    this.play();
  }

  /** Stops playback and resets position. Cancels any pending fade or
   * scheduled start. */
  stop(): void {
    this.disarmUnlockListener();

    if (this.fadeTween) {
      this.fadeTween.kill();
      this.fadeTween = null;
    }
    if (this.delayedStart) {
      this.delayedStart.kill();
      this.delayedStart = null;
    }

    const audio = this.audio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.min(1, Math.max(0, volume));
    }
  }

  /** Starts playback (if needed) and fades the volume up to
   * targetVolume over durationMs. */
  fadeIn(targetVolume: number, durationMs: number): void {
    const audio = this.audio;
    if (!audio || this.destroyed) return;

    this.play();

    if (this.fadeTween) this.fadeTween.kill();
    this.fadeTween = gsap.to(audio, {
      volume: Math.min(1, Math.max(0, targetVolume)),
      duration: durationMs / 1000,
      ease: 'power1.inOut',
    });
  }

  /** Fades the current volume down to 0 over durationMs, then pauses
   * and resets position. If playback never actually started (still
   * paused), skips the pointless fade and stops immediately. */
  fadeOut(durationMs: number, onComplete?: () => void): void {
    this.disarmUnlockListener();

    if (this.delayedStart) {
      this.delayedStart.kill();
      this.delayedStart = null;
    }

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

  /** Schedules fadeIn to begin after delayMs. Cancelled by stop(),
   * fadeOut(), or destroy() if it hasn't fired yet. */
  scheduleFadeIn(delayMs: number, targetVolume: number, durationMs: number): void {
    if (this.destroyed) return;
    if (this.delayedStart) this.delayedStart.kill();

    if (delayMs <= 0) {
      this.fadeIn(targetVolume, durationMs);
      return;
    }

    this.delayedStart = gsap.delayedCall(delayMs / 1000, () => {
      this.delayedStart = null;
      this.fadeIn(targetVolume, durationMs);
    });
  }

  /** Full teardown: cancels everything, stops playback, releases the
   * audio element. Safe to call more than once. */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    this.disarmUnlockListener();

    if (this.fadeTween) {
      this.fadeTween.kill();
      this.fadeTween = null;
    }
    if (this.delayedStart) {
      this.delayedStart.kill();
      this.delayedStart = null;
    }

    const audio = this.audio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.audio = null;
  }
}