import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "hls-menu",
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule],
  template: `<button mat-button type="button" [matMenuTriggerFor]="menu">
      {{ selected }}
      <svg
        viewBox="0 0 10 5"
        focusable="false"
        aria-hidden="true"
        class="inline-block w-2 h-1 ml-0.5 align-middle fill-current"
      >
        <polygon points="0,0 5,5 10,0"></polygon>
      </svg>
    </button>

    <mat-menu #menu="matMenu" class="dense-menu" xPosition="before">
      <button
        mat-menu-item
        *ngFor="let option of options; trackBy: trackBy"
        (click)="onChange.emit(option.value)"
      >
        {{ option.label }}
      </button>
    </mat-menu> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu<Value> {
  @Input() value: Value;

  @Input() options: { value: Value; label: string }[] = [];

  @Output("change") onChange = new EventEmitter<Value>();

  get selected(): string {
    return this.options.find((o) => o.value === this.value)?.label;
  }

  trackBy(_: number, item: Value) {
    return item;
  }
}
