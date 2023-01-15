import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";

@Component({
  selector: "hls-channel-table-shimmer",
  templateUrl: "channel-table-shimmer.html",
  styleUrls: ["channel-table.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "channel-table" },
  standalone: true,
  imports: [MatTableModule, MatSortModule, RouterModule],
})
export class ChannelTableShimmer {
  @ViewChild(MatSort) sort: MatSort;

  data = new Array(7);

  displayedColumns: string[] = [
    "shimmerProfile",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
  ];
}
