import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NamePipe } from "src/app/shared";
import { VTuberService } from "src/app/shared/config/vtuber.service";

import animations from "../_animations";

@Component({
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    MatListModule,
    OverlayModule,
    NamePipe,
  ],
  selector: "hls-vtuber-filter",
  templateUrl: "vtuber-filter.html",
  styleUrls: ["vtuber-filter.scss"],
  animations,
  encapsulation: ViewEncapsulation.None,
})
export class VTuberFilter {
  private vtubers = inject(VTuberService);

  selected: Set<string> = new Set();

  _isOpen = false;

  _vtubers = [...this.vtubers.selected];

  _listSelected = false;

  @Output() selectedChange = new EventEmitter<Set<string>>();

  public clear() {
    this._listSelected = false;
    this.selected.clear();
  }

  hasVTuber(id: string): boolean {
    return this.selected.has(id);
  }

  onClickOutside(event: MouseEvent) {
    event.stopPropagation();
    this._isOpen = false;
  }

  onClick(id: string) {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
    this.selectedChange.next(this.selected);
  }

  onListChange(event: MatSelectionListChange) {
    this._listSelected = event.options.some((option) => option.selected);
    event.options.forEach((option) => {
      if (option.selected) {
        this.selected.add(option.value);
      } else {
        this.selected.delete(option.value);
      }
    });
    this.selectedChange.next(this.selected);
  }
}
