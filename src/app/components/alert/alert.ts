import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  imports: [MatIconModule],
  selector: "vts-alert",
  template: `
    <mat-icon
      color="primary"
      class="!w-20 !h-20 mb-4"
      svgIcon="alert-decagram-outline"
    />
    <ng-content />
  `,
  host: { class: "my-32 text-center block" },
})
export class Alert {}
