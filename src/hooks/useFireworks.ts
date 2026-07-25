"use client";

import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
}

const COLORS = ["#ffdca8", "#ff9e6d", "#ff6b9d", "#7ee8fa", "#c4b5fd", "#fef08a"];

const ROCKET_SPAWN_INTERVAL_MIN = 380;
const ROCKET_SPAWN_INTERVAL_MAX = 720;
const MIN_BURST_PARTICLES = 24;
const MAX_BURST_PARTICLES = 46;
const GRAVITY = 260;
const PARTICLE_GRAVITY = 120;
const PARTICLE_DRAG = 0.985;

export interface UseFireworksResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  start: () => void;
  stop: () => void;
}

/**
 * Drives a self-contained canvas rocket/burst fireworks animation.
 * Renders nothing on its own and never starts automatically — the caller
 * (Fireworks.tsx) exposes `start`/`stop` via an imperative handle for the
 * Scene 1 master timeline to trigger explicitly.
 */
export function useFireworks(): UseFireworksResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const nextSpawnRef = useRef(0);
  const lastTimeRef = useRef(0);
  const tickRef = useRef<(time: number) => void>(() => {});

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const spawnRocket = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    rocketsRef.current.push({
      x: width * (0.18 + Math.random() * 0.64),
      y: height,
      targetY: height * (0.18 + Math.random() * 0.32),
      vx: (Math.random() - 0.5) * 20,
      vy: -(height * 0.5 + Math.random() * height * 0.25),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }, []);

  const burst = useCallback((x: number, y: number, color: string) => {
    const count =
      MIN_BURST_PARTICLES + Math.floor(Math.random() * (MAX_BURST_PARTICLES - MIN_BURST_PARTICLES));

    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 60 + Math.random() * 140;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.6,
        color,
        size: 1.5 + Math.random() * 2,
      });
    }
  }, []);

  const tick = useCallback(
    (time: number) => {
      if (!runningRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) {
        rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
        return;
      }

      const last = lastTimeRef.current || time;
      const dt = Math.min(0.05, (time - last) / 1000);
      lastTimeRef.current = time;

      if (time >= nextSpawnRef.current) {
        spawnRocket();
        nextSpawnRef.current =
          time +
          ROCKET_SPAWN_INTERVAL_MIN +
          Math.random() * (ROCKET_SPAWN_INTERVAL_MAX - ROCKET_SPAWN_INTERVAL_MIN);
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      rocketsRef.current = rocketsRef.current.filter((rocket) => {
        rocket.x += rocket.vx * dt;
        rocket.y += rocket.vy * dt;
        rocket.vy += GRAVITY * dt;

        ctx.beginPath();
        ctx.fillStyle = rocket.color;
        ctx.globalAlpha = 0.9;
        ctx.arc(rocket.x, rocket.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (rocket.vy >= 0 || rocket.y <= rocket.targetY) {
          burst(rocket.x, rocket.y, rocket.color);
          return false;
        }
        return true;
      });

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += dt;
        if (p.life >= p.maxLife) return false;

        p.vy += PARTICLE_GRAVITY * dt;
        p.vx *= PARTICLE_DRAG;
        p.vy *= PARTICLE_DRAG;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
    },
    [burst, spawnRocket]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const stop = useCallback(() => {
    runningRef.current = false;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    particlesRef.current = [];
    rocketsRef.current = [];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;

    runningRef.current = true;
    lastTimeRef.current = 0;
    nextSpawnRef.current = 0;
    resize();
    rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
  }, [resize]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      stop();
    };
  }, [resize, stop]);

  return { canvasRef, start, stop };
}