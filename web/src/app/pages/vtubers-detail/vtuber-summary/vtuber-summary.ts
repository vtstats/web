import { Component, Input, OnInit } from "@angular/core";
import { VTuber } from "src/app/models";

@Component({
  selector: "hls-vtuber-summary",
  templateUrl: "vtuber-summary.html",
  styleUrls: ["vtuber-summary.scss"],
})
export class VtuberSummary implements OnInit {
  @Input() vtuber: VTuber;

  constructor() {}

  ngOnInit() {}
}
