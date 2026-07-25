/**
 * Reference offsets (seconds) documenting the finale's intended emotional
 * pacing. createScene5Timeline positions most segments relative to GSAP
 * labels instead of these raw numbers (labels stay in sync automatically
 * as earlier segments change length); this map exists so the overall
 * shape of the show is visible and tunable in one place.
 */
export const TIMELINE_LABELS = {
  fadeIn: 0,
  silence: 0.4,
  firstFirework: 3.2,
  fireworksSequence: 3.2,
  grandFinale: 33.4,
  fireworksCalm: 40,
  titleReveal: 42.5,
  blessingReveal: 47,
  finalMessage: 55.5,
  sceneFadeOut: 63,
} as const;

export const MASTER_TIMELINE_TOTAL_DURATION = 68;