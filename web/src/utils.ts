export const within = (v: number, min: number, max: number): boolean =>
  min <= v && v <= max;

export const truncateTo15Seconds = (v: number): number => v - (v % 15_000);

export const isTouchDevice =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;
