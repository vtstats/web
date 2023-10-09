import { isPlatformServer } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { interval, map, Observable, of, shareReplay, startWith } from "rxjs";

@Injectable({ providedIn: "root" })
export class TickService {
  everySecond$: Observable<Date>;

  everyMinute$: Observable<Date>;

  platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformServer(this.platformId)) {
      this.everySecond$ = of(new Date());
      this.everyMinute$ = of(new Date());
    } else {
      this.everySecond$ = interval(1000).pipe(
        map(() => new Date()),
        startWith(new Date()),
        shareReplay(1)
      );

      this.everyMinute$ = interval(60 * 1000).pipe(
        map(() => new Date()),
        startWith(new Date()),
        shareReplay(1)
      );
    }
  }
}
