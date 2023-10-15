import { fromEvent, map, Observable, of, startWith } from "rxjs";

export function fromMediaMatch(
  query: string,
  ssr: boolean = false
): Observable<boolean> {
  if (typeof window === "undefined") {
    return of(ssr);
  }

  const mediaQuery = window.matchMedia(query);

  return fromEvent<MediaQueryList>(mediaQuery, "change").pipe(
    map((list) => list.matches),
    startWith(mediaQuery.matches)
  );
}
