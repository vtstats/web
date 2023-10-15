import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  standalone: true,
  imports: [DatePipe, MatTooltipModule, MatIconModule, MatButtonModule],
  selector: "vts-refresh-button",
  template: `
    <button
      mat-icon-button
      [disabled]="isLoading"
      (click)="refresh()"
      i18n-matTooltip="@@updated-at"
      matTooltip="Updated at {{ updatedAt | date : 'MM/dd HH:mm' }}"
      aria-label="Refresh"
    >
      <mat-icon [class.animate-spin]="isLoading" svgIcon="refresh" />
    </button>
  `,
})
export class RefreshButton {
  @Input() isLoading: boolean = false;
  @Input() updatedAt: Date | number | undefined;
  @Input({ required: true }) refresh!: VoidFunction;
}
