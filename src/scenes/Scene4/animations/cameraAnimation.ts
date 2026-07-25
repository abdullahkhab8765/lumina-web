import gsap from 'gsap';
import { CAMERA_ZOOM_DURATION, CAMERA_ZOOM_SCALE } from '../constants/scene4';
import { EASE_GENTLE } from '../utils/easing';

export function createCameraZoomTween(camera: HTMLElement | null): gsap.core.Tween | null {
  if (!camera) return null;

  gsap.set(camera, { scale: 1, transformOrigin: '50% 45%', force3D: true });

  return gsap.to(camera, {
    scale: CAMERA_ZOOM_SCALE,
    duration: CAMERA_ZOOM_DURATION,
    ease: EASE_GENTLE,
  });
}