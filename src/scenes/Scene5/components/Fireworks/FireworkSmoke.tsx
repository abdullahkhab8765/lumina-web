interface SmokePuff {
  x: number;
  y: number;
  radius: number;
  growth: number;
  life: number;
  decay: number;
  active: boolean;
}

const MAX_SMOKE_PUFFS = 60;
const puffPool: SmokePuff[] = Array.from({ length: MAX_SMOKE_PUFFS }, () => ({
  x: 0,
  y: 0,
  radius: 0,
  growth: 0,
  life: 0,
  decay: 0,
  active: false,
}));

export class FireworkSmoke {
  private activePuffs: SmokePuff[] = [];

  spawn(x: number, y: number, count = 3): void {
    for (let i = 0; i < count; i += 1) {
      const puff = puffPool.find((p) => !p.active);
      if (!puff) return;
      puff.active = true;
      puff.x = x + (Math.random() - 0.5) * 20;
      puff.y = y + (Math.random() - 0.5) * 20;
      puff.radius = 8 + Math.random() * 10;
      puff.growth = 0.15 + Math.random() * 0.15;
      puff.life = 0.35;
      puff.decay = 0.0035 + Math.random() * 0.002;
      this.activePuffs.push(puff);
    }
  }

  get alive(): boolean {
    return this.activePuffs.length > 0;
  }

  update(): void {
    for (let i = this.activePuffs.length - 1; i >= 0; i -= 1) {
      const puff = this.activePuffs[i];
      puff.radius += puff.growth;
      puff.life -= puff.decay;
      if (puff.life <= 0) {
        puff.active = false;
        const last = this.activePuffs.pop();
        if (last && i < this.activePuffs.length) {
          this.activePuffs[i] = last;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const puff of this.activePuffs) {
      ctx.globalAlpha = Math.max(puff.life, 0) * 0.5;
      ctx.fillStyle = 'rgba(200, 190, 180, 1)';
      ctx.beginPath();
      ctx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}