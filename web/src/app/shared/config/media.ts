import { fromEvent, Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

export function fromMediaMatch(query: string): Observable<boolean> {
  const mediaQuery = window.matchMedia(query);

  return fromEvent<MediaQueryList>(mediaQuery, "change").pipe(
    map((list) => list.matches),
    startWith(mediaQuery.matches)
  );
}
