export interface LightFlash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  color: string;
}

export function createLightFlash(x: number, y: number, color: string, maxRadius: number): LightFlash {
  return { x, y, radius: 4, maxRadius, life: 1, color };
}

/** Mutates `flash` in place -- no per-frame object allocation. */
export function updateLightFlash(flash: LightFlash): void {
  flash.radius += (flash.maxRadius - flash.radius) * 0.3;
  flash.life = Math.max(flash.life - 0.09, 0);
}

const GRADIENT_CACHE_LIMIT = 48;
const gradientCache = new Map<string, CanvasGradient>();

/**
 * Radial gradients are built centered at the origin and cached by
 * color + rounded radius, then reused at any (x, y) via ctx.translate.
 * Without this, createRadialGradient (a genuinely expensive call) ran
 * once per active flash, every single frame.
 */
function getFlashGradient(ctx: CanvasRenderingContext2D, radius: number, color: string): CanvasGradient {
  const roundedRadius = Math.max(4, Math.round(radius / 4) * 4);
  const key = `${color}:${roundedRadius}`;
  const cached = gradientCache.get(key);
  if (cached) return cached;

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, roundedRadius);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.4, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  if (gradientCache.size >= GRADIENT_CACHE_LIMIT) {
    const oldestKey = gradientCache.keys().next().value;
    if (oldestKey) gradientCache.delete(oldestKey);
  }
  gradientCache.set(key, gradient);
  return gradient;
}

export function drawLightFlash(ctx: CanvasRenderingContext2D, flash: LightFlash): void {
  if (flash.life <= 0) return;
  const gradient = getFlashGradient(ctx, flash.radius, flash.color);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = flash.life * 0.8;
  ctx.translate(flash.x, flash.y);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, flash.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}