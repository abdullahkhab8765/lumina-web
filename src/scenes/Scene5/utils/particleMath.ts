export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function polarToCartesian(cx: number, cy: number, angle: number, radius: number): { x: number; y: number } {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

export interface SeededPoint {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Deterministic pseudo-random field generator so particle layers are
 * stable between server and client renders (no Math.random during render).
 */
export function createSeededPoints(count: number, seedOffset = 0): SeededPoint[] {
  const points: SeededPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (i + seedOffset) / count;
    points.push({
      left: (seed * 89 + seedOffset * 17) % 100,
      top: (seed * 53 + seedOffset * 11 + 7) % 100,
      size: 1 + ((i * 4 + seedOffset) % 4),
      delay: (i * 0.35 + seedOffset * 0.2) % 6,
      duration: 8 + ((i * 3 + seedOffset) % 10),
    });
  }
  return points;
}

/**
 * Splits a point array into `bucketCount` contiguous chunks (matching DOM
 * order), so a component can drive many similar elements with a handful
 * of grouped GSAP tweens instead of one tween per element.
 */
export function bucketPoints<T>(points: T[], bucketCount: number): T[][] {
  const buckets: T[][] = Array.from({ length: bucketCount }, () => []);
  const chunkSize = Math.max(Math.ceil(points.length / bucketCount), 1);
  points.forEach((point, i) => {
    const bucketIndex = Math.min(Math.floor(i / chunkSize), bucketCount - 1);
    buckets[bucketIndex].push(point);
  });
  return buckets;
}