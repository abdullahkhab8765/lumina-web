import type { FireworkLaunchEvent } from '../types/fireworks';

export const FIREWORK_COLORS: Record<string, string> = {
  gold: '#FFD866',
  blue: '#5AB2FF',
  white: '#FFFFFF',
  amber: '#FF9E4D',
  rose: '#FF8FB1',
};

/**
 * Hand-authored, non-random choreography. Every `delay` is seconds after
 * the fireworks phase begins (see createScene5Timeline's "fireworksStart"
 * label) — never randomized, so the show is identical every playback.
 */
export const FIREWORK_SEQUENCE: FireworkLaunchEvent[] = [
  // Single Golden Burst
  { id: 'burst-1', delay: 0, originXPercent: 50, apexYPercent: 32, shape: 'burst', color: 'gold', scale: 1 },

  // Left + Right Launch
  { id: 'burst-2-left', delay: 3.2, originXPercent: 28, apexYPercent: 30, shape: 'burst', color: 'white', scale: 0.9 },
  { id: 'burst-2-right', delay: 3.4, originXPercent: 72, apexYPercent: 30, shape: 'burst', color: 'white', scale: 0.9 },

  // Double Burst
  { id: 'burst-3-a', delay: 6.6, originXPercent: 38, apexYPercent: 26, shape: 'burst', color: 'amber', scale: 1.1 },
  { id: 'burst-3-b', delay: 6.9, originXPercent: 62, apexYPercent: 26, shape: 'burst', color: 'amber', scale: 1.1 },

  // Golden Willow
  { id: 'willow-1', delay: 10.4, originXPercent: 50, apexYPercent: 24, shape: 'willow', color: 'gold', scale: 1.3 },

  // Blue Peony
  { id: 'peony-1', delay: 15, originXPercent: 44, apexYPercent: 28, shape: 'peony', color: 'blue', scale: 1.2 },

  // Palm Firework
  { id: 'palm-1', delay: 19, originXPercent: 56, apexYPercent: 22, shape: 'palm', color: 'gold', scale: 1.35 },

  // Triple Burst
  { id: 'burst-4-a', delay: 23.5, originXPercent: 30, apexYPercent: 30, shape: 'burst', color: 'rose', scale: 1 },
  { id: 'burst-4-b', delay: 23.8, originXPercent: 50, apexYPercent: 24, shape: 'burst', color: 'white', scale: 1.1 },
  { id: 'burst-4-c', delay: 24.1, originXPercent: 70, apexYPercent: 30, shape: 'burst', color: 'rose', scale: 1 },

  // Pause (silent gap before the grand finale — the space between the
  // previous delay and the next entry below)

  // Grand Finale
  { id: 'finale-1', delay: 30, originXPercent: 32, apexYPercent: 20, shape: 'peony', color: 'gold', scale: 1.6, isFinale: true },
  { id: 'finale-2', delay: 30.3, originXPercent: 50, apexYPercent: 16, shape: 'willow', color: 'gold', scale: 1.8, isFinale: true },
  { id: 'finale-3', delay: 30.6, originXPercent: 68, apexYPercent: 20, shape: 'peony', color: 'amber', scale: 1.6, isFinale: true },
  { id: 'finale-4', delay: 31.4, originXPercent: 22, apexYPercent: 26, shape: 'burst', color: 'white', scale: 1.2, isFinale: true },
  { id: 'finale-5', delay: 31.7, originXPercent: 78, apexYPercent: 26, shape: 'burst', color: 'white', scale: 1.2, isFinale: true },
  { id: 'finale-6', delay: 32.4, originXPercent: 50, apexYPercent: 18, shape: 'palm', color: 'gold', scale: 2, isFinale: true },
];

export const ROCKET_ASCENT_SPEED_MIN = 7.5;
export const ROCKET_ASCENT_SPEED_MAX = 10.5;
export const ROCKET_GRAVITY = 0.05;

export const SPARK_GRAVITY = 0.07;
export const SPARK_DRAG = 0.976;

export const BURST_SPARK_COUNT: Record<string, number> = {
  burst: 90,
  willow: 140,
  peony: 160,
  palm: 120,
  ring: 100,
};

export const MAX_ACTIVE_SPARKS = 1400;