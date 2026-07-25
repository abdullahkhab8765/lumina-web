import gsap from 'gsap';

export function killTween(tween: gsap.core.Tween | gsap.core.Timeline | null | undefined): void {
  tween?.kill();
}

export function safeSet(target: gsap.TweenTarget | null | undefined, vars: gsap.TweenVars): void {
  if (!target) return;
  gsap.set(target, vars);
}