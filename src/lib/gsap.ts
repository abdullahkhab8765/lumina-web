import gsap from "gsap";

let initialized = false;

/**
 * Initializes GSAP once.
 * Safe to call multiple times.
 */
export function initGsap() {
  if (initialized) return;

  initialized = true;

  // Future GSAP plugins can be registered here.
  // Example:
  // gsap.registerPlugin(ScrollTrigger);
}

export { gsap };