import {
  ConnectedPosition,
  Overlay,
  OverlayModule,
} from "@angular/cdk/overlay";
import { NgFor, NgIf, NgOptimizedImage } from "@angular/common";
import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AvatarPipe, NamePipe } from "src/app/shared";
import { VTuberService } from "src/app/shared/config/vtuber.service";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import animations from "../_animations";

@Component({
  standalone: true,
  imports: [
    MatTooltipModule,
    NgIf,
    NgFor,
    MatListModule,
    OverlayModule,
    NamePipe,
    AvatarPipe,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
  ],
  selector: "hls-vtuber-filter",
  templateUrl: "vtuber-filter.html",
  animations,
  encapsulation: ViewEncapsulation.None,
})
export class VTuberFilter {
  closeScrollStrategy = inject(Overlay).scrollStrategies.close();
  positions: ConnectedPosition[] = [
    {
      originX: "start",
      originY: "bottom",
      overlayX: "start",
      overlayY: "top",
      offsetY: 10,
    },
    {
      originX: "start",
      originY: "top",
      overlayX: "start",
      overlayY: "bottom",
      offsetY: -10,
    },
  ];

  private vtubers = inject(VTuberService);

  selected: Set<string> = new Set();

  _isOpen = false;

  _vtubers = this.vtubers.selectedIds();

  @Output() selectedChange = new EventEmitter<Set<string>>();

  public clear() {
    this.selected.clear();
    this.selectedChange.next(this.selected);
  }

  onListChange(event: MatSelectionListChange) {
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
