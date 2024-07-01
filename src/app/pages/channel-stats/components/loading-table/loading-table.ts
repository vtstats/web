import { Component, ViewEncapsulation, inject } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: "vts-loading-table",
  templateUrl: "loading-table.html",
  imports: [MatTableModule, MatSortModule, RouterModule],
  styles: [
    `
      .channel-stats-table {
        .mat-sort-header-container {
          justify-content: flex-end;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  host: { class: "channel-stats-table" },
})
export class LoadingTable {
  data = new Array(20).fill((_: any) => {});

  route = inject(ActivatedRoute);
  kind = inject(ActivatedRoute).snapshot.data.kind;

  readonly displayedColumns: string[] = [
    "profile",
    "name",
    "value",
    "delta1d",
    "delta7d",
    "delta30d",
  ];

  readonly dataColumns: { f: string; t: string }[] = [
    {
      f: "delta1d",
      t: $localize`:@@last-day:Last Day`,
    },
    {
      f: "delta7d",
      t: $localize`:@@last-7days:Last 7 Days`,
    },
    {
      f: "delta30d",
      t: $localize`:@@last-30days:Last 30 Days`,
    },
  ];
}
