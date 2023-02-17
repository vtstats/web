import { Injectable } from "@angular/core";
import { interval, map, Observable, shareReplay, startWith } from "rxjs";

@Injectable({ providedIn: "root" })
export class TickService {
  everySecond$: Observable<Date> = interval(1000).pipe(
    map(() => new Date()),
    startWith(new Date()),
    shareReplay(1)
  );

  everyMinute$: Observable<Date> = interval(60 * 1000).pipe(
    map(() => new Date()),
    startWith(new Date()),
    shareReplay(1)
  );
}
