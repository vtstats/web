import {
  ConnectedPosition,
  Overlay,
  OverlayModule,
} from "@angular/cdk/overlay";

import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Platform } from "src/app/models";

@Component({
  standalone: true,
  selector: "vts-platform-filter",
  templateUrl: "platform-filter.html",
  imports: [OverlayModule, MatButtonModule, MatMenuModule, MatIconModule],
})
export class PlatformFilter {
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

  @Input({ transform: booleanAttribute }) hideYouTube = false;
  @Input({ transform: booleanAttribute }) hideTwitch = false;
  @Input({ transform: booleanAttribute }) hideBilibili = false;

  selected = signal(Platform.YOUTUBE);

  text = computed(() => {
    switch (this.selected()) {
      case Platform.YOUTUBE: {
        return `YouTube`;
      }
      case Platform.BILIBILI: {
        return `Bilibili`;
      }
      case Platform.TWITCH: {
        return `Twitch`;
      }
    }
  });

  _isOpen = false;

  handleChange = (value: string) => {
    this.selected.set(value as any);
    this.onChange.emit(value);
  };

  @Output() onChange = new EventEmitter<string>();
}
