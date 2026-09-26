export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Hover/state tweens collapse to instant changes for reduced-motion users. */
export function motionDuration(seconds: number) {
  if (typeof window === "undefined") return seconds;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? 0 : seconds;
}
