import { QueryKey, QueryObserver } from "@tanstack/query-core";

export const within = (v: number, min: number, max: number): boolean =>
  min <= v && v <= max;

export const truncateTo15Seconds = (v: number): number => v - (v % 15_000);

export const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || window.navigator.maxTouchPoints > 0);

// some wrappers encapsulating local storage operations
// it avoids SecurityError: the operation is insecure (in safari)
// and ReferenceError: window is not defined (in ssr)

export const getLocalStorage = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const setLocalStorage = (key: string, value: string) => {
  try {
    return window.localStorage.setItem(key, value);
  } catch (e) {}
};

export const removeLocalStorage = (key: string) => {
  try {
    return window.localStorage.removeItem(key);
  } catch (e) {}
};

export const sampling = <T>(
  rows: T[],
  config: { count: number } | { step: number },
  dateFn: (i: T) => number,
  valueFn: (i: T) => number,
  sampleFn: (a: number, b: number) => number
): [number, number][] => {
  if (rows.length == 0) return [];

  const result = [];

  const min = Math.min(...rows.map(dateFn));

  let step: number;

  if ("step" in config) {
    step = config.step;
  } else {
    const max = Math.max(...rows.map(dateFn));
    step = ((max - min) / config.count) | 0;
  }

  let i = min + step;

  result.push([min, 0]);

  for (const row of rows) {
    if (dateFn(row) <= i) {
      let last = result[result.length - 1];
      last[1] = sampleFn(valueFn(row), last[1]);
    } else {
      result.push([i, valueFn(row)]);
      i += step;
    }
  }

  return result;
};
