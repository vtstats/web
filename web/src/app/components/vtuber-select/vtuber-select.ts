import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { MatSelectionListChange } from "@angular/material/list";
import { ConfigService } from "src/app/shared";

@Component({
  selector: "hs-vtuber-select",
  templateUrl: "vtuber-select.html",
  styleUrls: ["vtuber-select.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("transform", [
      state(
        "void",
        style({
          opacity: 0,
          transform: "scale(0.8)",
        })
      ),
      transition(
        "void => enter",
        animate(
          "120ms cubic-bezier(0, 0, 0.2, 1)",
          style({
            opacity: 1,
            transform: "scale(1)",
          })
        )
      ),
      transition(
        "* => void",
        animate("100ms 25ms linear", style({ opacity: 0 }))
      ),
    ]),
  ],
})
export class VTuberSelect {
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
