import type { FireworkShape } from '../types/fireworks';
import { BURST_SPARK_COUNT } from '../config/fireworksConfig';

export function getSparkCount(shape: FireworkShape, scale: number): number {
  return Math.round(BURST_SPARK_COUNT[shape] * scale);
}

function buildAngleTemplate(shape: FireworkShape, count: number): Float32Array {
  const template = new Float32Array(count);

  if (shape === 'palm') {
    const arms = 7;
    const perArm = Math.max(Math.round(count / arms), 1);
    let idx = 0;
    for (let a = 0; a < arms && idx < count; a += 1) {
      const armAngle = (a / arms) * Math.PI * 2;
      for (let i = 0; i < perArm && idx < count; i += 1, idx += 1) {
        template[idx] = armAngle;
      }
    }
    while (idx < count) {
      template[idx] = (idx / count) * Math.PI * 2;
      idx += 1;
    }
    return template;
  }

  for (let i = 0; i < count; i += 1) {
    template[i] = (i / count) * Math.PI * 2;
  }
  return template;
}

const angleTemplateCache = new Map<string, Float32Array>();

/**
 * Base angle distribution for a shape+count pair, computed once and
 * cached. Every burst of that shape reuses the same template array
 * (random jitter is still applied per-spark at spawn time in
 * FireworkBurst, so bursts stay visually organic) instead of allocating
 * a fresh angle set on every explosion.
 */
export function getAngleTemplate(shape: FireworkShape, scale: number): Float32Array {
  const count = getSparkCount(shape, scale);
  const key = `${shape}:${count}`;
  const cached = angleTemplateCache.get(key);
  if (cached) return cached;

  const template = buildAngleTemplate(shape, count);
  angleTemplateCache.set(key, template);
  return template;
}

export function getSparkJitter(shape: FireworkShape): number {
  switch (shape) {
    case 'willow':
      return 0.12;
    case 'peony':
      return 0.2;
    case 'palm':
      return 0.16;
    case 'ring':
      return 0;
    case 'burst':
    default:
      return 0.3;
  }
}

export function getSparkSpeed(shape: FireworkShape, index: number, count: number, scale: number): number {
  switch (shape) {
    case 'willow':
      return (2.2 + Math.random() * 2.2) * scale;
    case 'peony':
      return (3 + Math.random() * 3.4) * scale;
    case 'palm': {
      const perArm = Math.max(Math.round(count / 7), 1);
      const withinArm = index % perArm;
      return (3.6 + (withinArm / perArm) * 2.4) * scale;
    }
    case 'ring':
      return 4 * scale;
    case 'burst':
    default:
      return (1.8 + Math.random() * 4.6) * scale;
  }
}

export function getSparkSizeMultiplier(shape: FireworkShape): number {
  switch (shape) {
    case 'willow':
      return 1.1;
    case 'palm':
      return 1.15;
    default:
      return 1;
  }
}