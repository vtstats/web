import {
  ApplicationRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SwUpdate } from "@angular/service-worker";
import { concat, interval } from "rxjs";
import { first, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "hls-update-indicator",
  templateUrl: "update-indicator.html",
  styleUrls: ["update-indicator.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "update-indicator" },
})
export class UpdateIndicator implements OnInit {
  status: "checking" | "failed" | "updated" | "outdated" | undefined;

  constructor(
    private appRef: ApplicationRef,
    private swUpdates: SwUpdate,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (!this.swUpdates.isEnabled) return;

    const appIsStable$ = this.appRef.isStable.pipe(
      first((isStable) => isStable === true)
    );

    const everySixHours$ = interval(6 * 60 * 60 * 1000);

    this.swUpdates.unrecoverable.subscribe(() => {
      window.location.reload();
    });

    concat(appIsStable$, everySixHours$)
      .pipe(
        tap(() => (this.status = "checking")),
        switchMap(() => this.swUpdates.checkForUpdate())
      )
      .subscribe({
        next: (ready) => {
          if (ready) {
            this.status = "outdated";
            this.snackBar
              .open("New version found", "UPDATE")
              .onAction()
              .subscribe(() => window.location.reload());
          } else {
            this.status = "updated";
          }
        },
        error: (err) => {
          this.status = "failed";
          console.error(err);
        },
      });
  }
}
