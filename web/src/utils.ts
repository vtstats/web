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
