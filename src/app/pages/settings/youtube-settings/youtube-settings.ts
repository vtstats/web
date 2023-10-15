import { AsyncPipe, NgIf, NgOptimizedImage } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { GoogleService } from "src/app/shared/config/youtube.service";
import { PlaylistSelector } from "./playlist-selector/playlist-selector";

@Component({
  standalone: true,
  selector: "google-button",
  template: `<div #button></div>`,
})
export class GoogleButton implements AfterViewInit {
  @ViewChild("button", { static: true, read: ElementRef }) spinner!: ElementRef;

  ngAfterViewInit(): void {
    google.accounts.id.renderButton(this.spinner.nativeElement, {
      type: "standard",
      theme: "outline",
      size: "large",
    });
  }
}

@Component({
  standalone: true,
  imports: [
    GoogleButton,
    PlaylistSelector,
    MatIconModule,
    AsyncPipe,
    NgIf,
    MatButtonModule,
    NgOptimizedImage,
  ],
  selector: "vts-youtube-settings",
  templateUrl: "youtube-settings.html",
})
export class YouTubeSettings {
  google = inject(GoogleService);
}
