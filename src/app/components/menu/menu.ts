import { NgFor } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "vts-menu",
  standalone: true,
  imports: [NgFor, MatMenuModule, MatIconModule, MatButtonModule],
  template: `
    <button
      mat-button
      class="!rounded-full"
      type="button"
      [matMenuTriggerFor]="menu"
      (menuClosed)="open = false"
      (menuOpened)="open = true"
    >
      {{ selected }}
      <mat-icon
        [class.rotate-180]="open"
        iconPositionEnd
        svgIcon="unfold-more-horizontal"
      />
    </button>

    <mat-menu
      #menu="matMenu"
      class="dense-menu vts-menu-panel max-h-80"
      xPosition="before"
    >
      <button
        mat-menu-item
        *ngFor="let option of options; trackBy: trackBy"
        (click)="onChange.emit(option.value)"
      >
        {{ option.label }}
      </button>
    </mat-menu>
  `,
  styleUrls: ["./menu.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "-mat-button-density-1" },
})
export class Menu<Value> {
  @Input() value: Value | null = null;
  @Input() showLabel: boolean = true;
  @Input() options: { value: Value; label: string }[] = [];

  open: boolean;

  @Output("change") onChange = new EventEmitter<Value>();

  get selected(): string | undefined {
    const option = this.options.find((o) => o.value === this.value);
    if (!option) return undefined;
    return this.showLabel ? option.label : String(option.value);
  }

  trackBy(_: number, item: { value: Value; label: string }) {
    return item.value;
  }
}
