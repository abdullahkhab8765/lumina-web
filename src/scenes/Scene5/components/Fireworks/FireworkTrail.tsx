/**
 * Draws a single line-segment trail (previous position -> current
 * position) instead of maintaining a growing array of past points.
 * Rockets and sparks each keep only two numbers (prevX/prevY), so trails
 * cost zero extra allocation per frame and one stroke() call instead of
 * several arc()+fill() calls.
 */
export function drawLineTrail(
  ctx: CanvasRenderingContext2D,
  prevX: number,
  prevY: number,
  x: number,
  y: number,
  color: string,
  alpha: number,
  width: number
): void {
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();
}