import { drawLineTrail } from './FireworkTrail';
import { ROCKET_ASCENT_SPEED_MIN, ROCKET_ASCENT_SPEED_MAX, ROCKET_GRAVITY } from '../../config/fireworksConfig';
import type { FireworkShape } from '../../types/fireworks';

export class FireworkLauncher {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  targetY = 0;
  color = '#ffffff';
  shape: FireworkShape = 'burst';
  scale = 1;
  prevX = 0;
  prevY = 0;
  hasPrev = false;
  done = false;

  reset(x: number, startY: number, targetY: number, color: string, shape: FireworkShape, scale: number): void {
    this.x = x;
    this.y = startY;
    this.targetY = targetY;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -(ROCKET_ASCENT_SPEED_MIN + Math.random() * (ROCKET_ASCENT_SPEED_MAX - ROCKET_ASCENT_SPEED_MIN));
    this.color = color;
    this.shape = shape;
    this.scale = scale;
    this.prevX = x;
    this.prevY = startY;
    this.hasPrev = false;
    this.done = false;
  }

  update(): void {
    this.prevX = this.x;
    this.prevY = this.y;
    this.hasPrev = true;
    this.vy += ROCKET_GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    if (this.vy >= 0 || this.y <= this.targetY) {
      this.done = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    if (this.hasPrev) {
      drawLineTrail(ctx, this.prevX, this.prevY, this.x, this.y, this.color, 0.55, 2);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Rockets are few at any moment (at most a handful during the finale), so
 * pooling buys little here -- but reusing instances instead of allocating
 * fresh ones per launch is essentially free and keeps the pattern
 * consistent with the spark pool below.
 */
const pool: FireworkLauncher[] = [];

export function acquireLauncher(
  x: number,
  startY: number,
  targetY: number,
  color: string,
  shape: FireworkShape,
  scale: number
): FireworkLauncher {
  const launcher = pool.pop() ?? new FireworkLauncher();
  launcher.reset(x, startY, targetY, color, shape, scale);
  return launcher;
}

export function releaseLauncher(launcher: FireworkLauncher): void {
  pool.push(launcher);
}