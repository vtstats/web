import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { MatSelectionListChange } from "@angular/material/list";
import { ConfigService } from "src/app/shared";

import animations from "./vtuber-filter-animations";

@Component({
  selector: "hs-vtuber-filter",
  templateUrl: "vtuber-filter.html",
  styleUrls: ["vtuber-filter.scss"],
  encapsulation: ViewEncapsulation.None,
  animations,
})
export class VTuberFilter {
  constructor(private config: ConfigService) {}

  selected: Set<string> = new Set();

  _isOpen = false;

  _vtubers = [...this.config.vtuber];

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
