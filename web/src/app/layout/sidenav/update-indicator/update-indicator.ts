import { CommonModule } from "@angular/common";
import { ApplicationRef, Component, inject, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SwUpdate } from "@angular/service-worker";
import { concat, interval } from "rxjs";
import { first, switchMap, tap } from "rxjs/operators";

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  selector: "hls-update-indicator",
  templateUrl: "update-indicator.html",
  host: { class: "inline-block align-middle" },
})
export class UpdateIndicator implements OnInit {
  private appRef = inject(ApplicationRef);
  private swUpdates = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  status: "checking" | "failed" | "updated" | "outdated" | undefined;

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
