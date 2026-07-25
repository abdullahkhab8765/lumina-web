export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function splitMessageParagraphs(message: string): string[] {
  return message
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

interface SeededPoint {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Deterministic pseudo-random generator so particle fields are stable
 * between server and client renders (no Math.random during render).
 */
export function createSeededPoints(count: number, seedOffset = 0): SeededPoint[] {
  const points: SeededPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (i + seedOffset) / count;
    points.push({
      left: (seed * 97 + seedOffset * 13) % 100,
      top: (seed * 61 + seedOffset * 7 + 11) % 100,
      size: 2 + ((i * 5 + seedOffset) % 5),
      delay: (i * 0.33 + seedOffset * 0.2) % 5,
      duration: 8 + ((i * 3 + seedOffset) % 6),
    });
  }
  return points;
}

export function isLastGift(index: number, total: number): boolean {
  return index === total - 1;
}