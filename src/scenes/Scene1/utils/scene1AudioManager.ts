import gsap from 'gsap';

export interface ThemeAudioConfig {
  src: string;
  loop: boolean;
  targetVolume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}

export interface FireworksAudioConfig {
  src: string;
  volume: number;
}

/**
 * Owns the two HTMLAudioElement instances used by Scene 1 (looping
 * background theme + one-shot fireworks sfx) and their GSAP volume
 * fades.
 *
 * Browser autoplay policy requires audio.play() to happen in direct
 * response to a user gesture. This cinematic sequence has no
 * interactive element until the Continue button at the very end, so
 * the *first* play() attempt (triggered from a GSAP timeline
 * callback, with no gesture) will normally be rejected. To recover
 * as early as legitimately possible, an "unlock" listener is armed
 * on window from the moment this manager is constructed — not only
 * reactively after a rejection — so that ANY interaction anywhere on
 * the page during the countdown/fireworks sequence retries both
 * tracks immediately. If the user genuinely never interacts until
 * clicking Continue, no script can start audible sound earlier than
 * that click — that is a browser platform restriction, not a bug.
 */
export class Scene1AudioManager {
  private readonly themeConfig: ThemeAudioConfig;
  private readonly fireworksConfig: FireworksAudioConfig;

  private themeAudio: HTMLAudioElement | null = null;
  private fireworksAudio: HTMLAudioElement | null = null;

  private themeFadeTween: gsap.core.Tween | null = null;

  private themeRequested = false;
  private themeAudible = false;
  private fireworksRequested = false;
  private fireworksPlayed = false;
  private shutdownCalled = false;

  private unlockHandler: (() => void) | null = null;

  constructor(themeConfig: ThemeAudioConfig, fireworksConfig: FireworksAudioConfig) {
    this.themeConfig = themeConfig;
    this.fireworksConfig = fireworksConfig;

    if (typeof window === 'undefined') return;

    this.themeAudio = new Audio(themeConfig.src);
    this.themeAudio.loop = themeConfig.loop;
    this.themeAudio.preload = 'auto';
    this.themeAudio.volume = 0;

    this.fireworksAudio = new Audio(fireworksConfig.src);
    this.fireworksAudio.loop = false;
    this.fireworksAudio.preload = 'auto';
    this.fireworksAudio.volume = fireworksConfig.volume;

    // Armed immediately, not reactively — maximizes the chance any
    // incidental interaction during the sequence unlocks audio well
    // before Continue is ever clicked.
    this.armUnlockListener();
  }

  private armUnlockListener(): void {
    if (this.unlockHandler || typeof window === 'undefined') return;

    this.unlockHandler = () => {
      if (this.themeRequested && !this.themeAudible) this.attemptThemePlay();
      if (this.fireworksRequested && !this.fireworksPlayed) this.attemptFireworksPlay();
    };

    window.addEventListener('pointerdown', this.unlockHandler);
    window.addEventListener('keydown', this.unlockHandler);
    window.addEventListener('touchstart', this.unlockHandler);
  }

  private disarmUnlockListener(): void {
    if (!this.unlockHandler) return;
    window.removeEventListener('pointerdown', this.unlockHandler);
    window.removeEventListener('keydown', this.unlockHandler);
    window.removeEventListener('touchstart', this.unlockHandler);
    this.unlockHandler = null;
  }

  private attemptThemePlay(): void {
    const audio = this.themeAudio;
    if (!audio || this.shutdownCalled || this.themeAudible) return;

    audio
      .play()
      .then(() => {
        // Guards the exact race that caused silent playback: if
        // shutdown() already ran (e.g. this resolved right as the
        // user clicked Continue), don't start a fade-in on an
        // element that's about to be torn down — just stop it.
        if (this.shutdownCalled) {
          audio.pause();
          return;
        }

        this.themeAudible = true;
        if (this.themeFadeTween) this.themeFadeTween.kill();
        this.themeFadeTween = gsap.to(audio, {
          volume: this.themeConfig.targetVolume,
          duration: this.themeConfig.fadeInDuration,
          ease: 'power1.inOut',
        });
      })
      .catch(() => {
        // Still blocked — the armed unlock listener retries on the
        // next interaction. Nothing else to do here.
      });
  }

  private attemptFireworksPlay(): void {
    const audio = this.fireworksAudio;
    if (!audio || this.shutdownCalled || this.fireworksPlayed) return;

    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        if (this.shutdownCalled) {
          audio.pause();
          return;
        }
        this.fireworksPlayed = true;
      })
      .catch(() => {
        // Still blocked — retried on next interaction via the unlock listener.
      });
  }

  /** Idempotent — safe to call more than once; marks the theme as
   * wanted and attempts to play it immediately. */
  startTheme(): void {
    if (this.themeRequested || this.shutdownCalled || !this.themeAudio) return;
    this.themeRequested = true;
    this.attemptThemePlay();
  }

  /** Idempotent per instance — marks fireworks sfx as wanted and
   * attempts to play it immediately. */
  playFireworksOnce(): void {
    if (this.fireworksRequested || this.shutdownCalled || !this.fireworksAudio) return;
    this.fireworksRequested = true;
    this.attemptFireworksPlay();
  }

  /**
   * Fades the theme to silence, stops both tracks, and disarms the
   * unlock listener. Safe to call multiple times.
   */
  shutdown(): void {
    if (this.shutdownCalled) return;
    this.shutdownCalled = true;

    this.disarmUnlockListener();

    const theme = this.themeAudio;
    if (this.themeFadeTween) this.themeFadeTween.kill();

    if (theme && this.themeAudible && !theme.paused) {
      this.themeFadeTween = gsap.to(theme, {
        volume: 0,
        duration: this.themeConfig.fadeOutDuration,
        ease: 'power1.inOut',
        onComplete: () => {
          theme.pause();
          theme.currentTime = 0;
        },
      });
    } else if (theme) {
      // Never actually became audible (still blocked, or its play()
      // promise hasn't resolved yet) — nothing to fade, just stop it
      // outright so a late-resolving play() can't start it after the
      // fact (see the shutdownCalled guards above).
      theme.pause();
      theme.currentTime = 0;
    }

    const fireworks = this.fireworksAudio;
    if (fireworks) {
      fireworks.pause();
      fireworks.currentTime = 0;
    }
  }
}