import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { timer } from "rxjs";
import { map } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

import { Stream } from "@holostats/libs/models";
import { VTUBERS } from "@holostats/libs/const";

import { ApiService, Config } from "../services";

@Component({
  selector: "hs-streams",
  templateUrl: "./streams.component.html",
  styleUrls: ["./streams.component.scss"]
})
export class StreamsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private config: Config,
    private spinnerService: NgxSpinnerService
  ) {}

  vtubers = VTUBERS;
  streams: Stream[] = [];
  updatedAt = "";
  showSpinner = false;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  obs = new IntersectionObserver(entries => {
    if (entries.map(e => e.isIntersecting).some(e => e)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.apiService
        .getStreamsWithSkip(
          this.config.selectedVTubers,
          this.streams[this.streams.length - 1].id
        )
        .subscribe(data => {
          this.streams = [...this.streams, ...data.streams];
          if (data.streams.length < 24) {
            this.showSpinner = false;
          } else {
            this.obs.observe(this.spinnerContainer.nativeElement);
          }
        });
    }
  });

  ngOnInit() {
    this.spinnerService.show();
    this.apiService.getStreams(this.config.selectedVTubers).subscribe(data => {
      this.streams = data.streams;
      this.updatedAt = data.updatedAt;
      this.spinnerService.hide();
      this.showSpinner = true;
      this.obs.observe(this.spinnerContainer.nativeElement);
    });
  }

  findVTuber(id: string) {
    return this.vtubers.find(v => v.id == id);
  }

  trackBy(_: number, stream: Stream): string {
    return stream.id;
  }
}
