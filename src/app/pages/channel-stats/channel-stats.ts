import { Component, OnInit, inject } from "@angular/core";
import { QryService } from "src/app/shared/qry";

@Component({
  selector: "hls-channel-stats",
  templateUrl: "channel-stats.html",
})
export class ChannelStats implements OnInit {
  private qry = inject(QryService);

  constructor() {}

  ngOnInit() {}
}
