import { getAngleTemplate, getSparkCount, getSparkJitter, getSparkSpeed, getSparkSizeMultiplier } from '../../utils/fireworkPatterns';
import { drawLineTrail } from './FireworkTrail';
import { createLightFlash, updateLightFlash, drawLightFlash, type LightFlash } from './FireworkLight';
import { SPARK_GRAVITY, SPARK_DRAG, MAX_ACTIVE_SPARKS } from '../../config/fireworksConfig';
import type { FireworkShape } from '../../types/fireworks';

class Spark {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  prevX = 0;
  prevY = 0;
  size = 1;
  life = 0;
  decay = 0;
  color = '#ffffff';

  reset(x: number, y: number, angle: number, speed: number, size: number, color: string): void {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = size;
    this.life = 1;
    this.decay = 0.008 + Math.random() * 0.012;
    this.color = color;
  }
}

/**
 * Fixed-capacity spark pool shared across every burst. Bursts acquire
 * spark instances from here instead of allocating new objects, and
 * release them back on death. Capacity is enforced here (not via
 * summing every burst's live count each explosion) -- acquireSpark
 * simply returns null once the pool is exhausted.
 */
const sparkPool: Spark[] = [];
let activeSparkCount = 0;

function acquireSpark(): Spark | null {
  if (activeSparkCount >= MAX_ACTIVE_SPARKS) return null;
  activeSparkCount += 1;
  return sparkPool.pop() ?? new Spark();
}

function releaseSpark(spark: Spark): void {
  activeSparkCount = Math.max(activeSparkCount - 1, 0);
  sparkPool.push(spark);
}

export class FireworkBurst {
  private readonly sparks: Spark[] = [];
  readonly color: string;
  private lightFlash: LightFlash;

  constructor(x: number, y: number, shape: FireworkShape, color: string, scale: number) {
    this.color = color;

    const count = getSparkCount(shape, scale);
    const template = getAngleTemplate(shape, scale);
    const jitter = getSparkJitter(shape);
    const sizeMultiplier = getSparkSizeMultiplier(shape);

    for (let i = 0; i < count; i += 1) {
      const spark = acquireSpark();
      if (!spark) break;
      const angle = template[i] + (Math.random() - 0.5) * jitter;
      const speed = getSparkSpeed(shape, i, count, scale);
      const size = (1 + Math.random() * 1.6) * sizeMultiplier;
      spark.reset(x, y, angle, speed, size, color);
      this.sparks.push(spark);
    }

    this.lightFlash = createLightFlash(x, y, color, 70 * scale);
  }

  get alive(): boolean {
    return this.sparks.length > 0 || this.lightFlash.life > 0;
  }

  update(): void {
    updateLightFlash(this.lightFlash);

    for (let i = this.sparks.length - 1; i >= 0; i -= 1) {
      const s = this.sparks[i];
      s.prevX = s.x;
      s.prevY = s.y;
      s.vx *= SPARK_DRAG;
      s.vy *= SPARK_DRAG;
      s.vy += SPARK_GRAVITY;
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        releaseSpark(s);
        // Swap-remove: O(1) instead of splice's O(n).
        const last = this.sparks.pop();
        if (last && i < this.sparks.length) {
          this.sparks[i] = last;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawLightFlash(ctx, this.lightFlash);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const s of this.sparks) {
      const alpha = Math.max(s.life, 0);
      if (alpha <= 0) continue;
      drawLineTrail(ctx, s.prevX, s.prevY, s.x, s.y, s.color, alpha * 0.45, s.size);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}