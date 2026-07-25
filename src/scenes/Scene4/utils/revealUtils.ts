export function isLastParagraph(index: number, total: number): boolean {
  return index === total - 1;
}

export interface SeededPoint {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Deterministic pseudo-random generator so particle/ray fields are stable
 * between server and client renders (no Math.random during render).
 */
export function createSeededPoints(count: number, seedOffset = 0): SeededPoint[] {
  const points: SeededPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (i + seedOffset) / count;
    points.push({
      left: (seed * 89 + seedOffset * 17) % 100,
      top: (seed * 53 + seedOffset * 11 + 7) % 100,
      size: 1.5 + ((i * 4 + seedOffset) % 4),
      delay: (i * 0.4 + seedOffset * 0.25) % 6,
      duration: 10 + ((i * 3 + seedOffset) % 8),
    });
  }
  return points;
}