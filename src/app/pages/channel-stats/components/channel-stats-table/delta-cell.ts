import {
  DecimalPipe,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault, DecimalPipe],
  selector: "vts-channel-stats-table-delta-cell",
  template: `
    <ng-container [ngSwitch]="true">
      <span class="up-color" *ngSwitchCase="delta > 0">
        {{ delta | number }}
      </span>
      <span class="down-color" *ngSwitchCase="delta < 0">
        {{ delta | number }}
      </span>
      <span class="mat-secondary-text" *ngSwitchDefault> --- </span>
    </ng-container>
  `,
})
export class DeltaCell {
  @Input({ required: true }) delta!: number;
}
