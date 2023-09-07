import { effect, signal } from "@angular/core";

export const within = (v: number, min: number, max: number): boolean =>
  min <= v && v <= max;

export const localStorageSignal = <T>(key: string, defaultValue: T) => {
  const s = signal(getLocalStorage(key, defaultValue));

  effect(() => {
    setLocalStorage(key, s());
  });

  return s;
};

// some wrappers encapsulating local storage operations
// it avoids SecurityError: the operation is insecure (in safari)
// and ReferenceError: window is not defined (in ssr)

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item && typeof item === "object") return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    return defaultValue;
  }
};

export const setLocalStorage = (key: string, value: any) => {
  try {
    return window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

export const removeLocalStorage = (key: string) => {
  try {
    return window.localStorage.removeItem(key);
  } catch (e) {}
};

export const sampling = <T>(
  rows: T[] | undefined,
  config: { count: number } | { step: number },
  dateFn: (i: T) => number,
  valueFn: (i: T) => number,
  sampleFn: (a: number, b: number) => number
): [number, number][] => {
  if (!rows || rows.length == 0) return [];

  const result: [number, number][] = [];

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
