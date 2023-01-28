import { fromEvent, Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";

export function fromMediaMatch(
  query: string,
  ssr?: boolean
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
