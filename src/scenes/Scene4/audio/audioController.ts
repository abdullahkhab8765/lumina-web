import gsap from 'gsap';
import type { Scene4AudioConfig } from './audioConfig';

export class AudioController {
  private readonly config: Scene4AudioConfig;

  private audio: HTMLAudioElement | null = null;
  private fadeTween: gsap.core.Tween | null = null;
  private unlockHandler: (() => void) | null = null;
  private destroyed = false;
  private mutedVolume: number | null = null;

  constructor(config: Scene4AudioConfig) {
    this.config = config;

    if (typeof window === 'undefined') return;

    const audio = new Audio(config.src);
    audio.loop = config.loop;
    audio.preload = config.preload;
    audio.volume = Math.min(1, Math.max(0, config.initialVolume));
    this.audio = audio;
    console.log('[AudioController] constructed, src =', config.src, 'initialVolume =', audio.volume);
  }

  private armUnlockListener(retry: () => void): void {
    if (this.unlockHandler || typeof window === 'undefined') return;

    console.log('[AudioController] arming autoplay-unlock retry listener');
    const handler = () => {
      console.log('[AudioController] unlock listener fired, retrying');
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

  play(): void {
    const audio = this.audio;
    if (!audio || this.destroyed || !audio.paused) {
      console.log(
        '[AudioController] play() early-return -- audio exists:', !!audio,
        'destroyed:', this.destroyed,
        'already playing (not paused):', audio ? !audio.paused : 'n/a'
      );
      return;
    }

    console.log('[AudioController] play() calling audio.play()');
    audio.play().then(() => {
      console.log('[AudioController] play() RESOLVED -- audio.paused =', audio.paused);
    }).catch((err) => {
      console.warn(`[AudioController] play() REJECTED for "${this.config.src}":`, err);
      if (this.destroyed) return;
      this.armUnlockListener(() => this.play());
    });
  }

  playAndFadeIn(targetVolume: number, durationMs: number): void {
    const audio = this.audio;
    if (!audio || this.destroyed) {
      console.log('[AudioController] playAndFadeIn() early-return -- audio exists:', !!audio, 'destroyed:', this.destroyed);
      return;
    }

    if (!audio.paused) {
      console.log('[AudioController] playAndFadeIn() -- already playing, going straight to fadeIn()');
      this.fadeIn(targetVolume, durationMs);
      return;
    }

    console.log('[AudioController] playAndFadeIn() calling audio.play()');
    audio
      .play()
      .then(() => {
        console.log('[AudioController] playAndFadeIn() play() RESOLVED, destroyed =', this.destroyed);
        if (this.destroyed) return;
        this.fadeIn(targetVolume, durationMs);
      })
      .catch((err) => {
        console.warn(`[AudioController] playAndFadeIn() play() REJECTED for "${this.config.src}":`, err);
        if (this.destroyed) return;
        this.armUnlockListener(() => this.playAndFadeIn(targetVolume, durationMs));
      });
  }

  pause(): void {
    console.log('[AudioController] pause() called');
    this.audio?.pause();
  }

  stop(): void {
    console.log('[AudioController] stop() called');
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

  restart(): void {
    const audio = this.audio;
    if (!audio || this.destroyed) return;

    this.stop();
    this.play();
  }

  fadeIn(targetVolume: number, durationMs: number): void {
    const audio = this.audio;
    if (!audio || this.destroyed) {
      console.log('[AudioController] fadeIn() early-return -- audio exists:', !!audio, 'destroyed:', this.destroyed);
      return;
    }

    console.log('[AudioController] fadeIn() -> targetVolume =', targetVolume, 'audio.paused before play() =', audio.paused);
    this.play();

    if (this.fadeTween) this.fadeTween.kill();
    this.fadeTween = gsap.to(audio, {
      volume: Math.min(1, Math.max(0, targetVolume)),
      duration: durationMs / 1000,
      ease: 'power1.inOut',
      onUpdate: () => {
        // Uncomment for extremely verbose per-frame volume tracing:
        // console.log('[AudioController] volume tick ->', audio.volume);
      },
    });
  }

  fadeOut(durationMs: number, onComplete?: () => void): void {
    console.log('[AudioController] fadeOut() called, durationMs =', durationMs);
    this.disarmUnlockListener();

    const audio = this.audio;
    if (!audio) {
      console.log('[AudioController] fadeOut() -- no audio element, calling onComplete immediately');
      onComplete?.();
      return;
    }

    if (this.fadeTween) this.fadeTween.kill();

    if (audio.paused) {
      console.log('[AudioController] fadeOut() -- audio already paused, skipping fade, calling onComplete immediately');
      audio.currentTime = 0;
      onComplete?.();
      return;
    }

    this.fadeTween = gsap.to(audio, {
      volume: 0,
      duration: durationMs / 1000,
      ease: 'power1.inOut',
      onComplete: () => {
        console.log('[AudioController] fadeOut() tween complete, pausing');
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

  cleanup(): void {
    this.disarmUnlockListener();
    if (this.fadeTween) {
      this.fadeTween.kill();
      this.fadeTween = null;
    }
  }

  destroy(): void {
    if (this.destroyed) {
      console.log('[AudioController] destroy() called but already destroyed -- no-op');
      return;
    }
    console.log('[AudioController] destroy() called -- tearing down');
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