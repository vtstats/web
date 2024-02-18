import { DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  imports: [DecimalPipe],
  selector: "vts-channel-stats-table-delta-cell",
  template: `
    @switch (true) {
      @case (delta > 0) {
        <span class="up-color">
          {{ delta | number }}
        </span>
      }
      @case (delta < 0) {
        <span class="down-color">
          {{ delta | number }}
        </span>
      }
      @default {
        <span class="mat-secondary-text"> --- </span>
      }
    }
  `,
})
export class DeltaCell {
  @Input({ required: true }) delta!: number;
}
