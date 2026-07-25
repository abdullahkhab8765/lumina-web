import { FIREWORK_SEQUENCE } from '../config/fireworksConfig';
import type { FireworkLaunchEvent } from '../types/fireworks';

export function getShowEndTime(): number {
  return FIREWORK_SEQUENCE.reduce((max, event) => Math.max(max, event.delay), 0) + 4;
}

export function getFinaleEvents(): FireworkLaunchEvent[] {
  return FIREWORK_SEQUENCE.filter((event) => event.isFinale);
}

export function getEarliestFinaleDelay(): number {
  const finaleEvents = getFinaleEvents();
  if (!finaleEvents.length) return 0;
  return finaleEvents.reduce((min, event) => Math.min(min, event.delay), Infinity);
}