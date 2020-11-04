import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "hs-not-found",
  templateUrl: "not-found.html",
  styleUrls: ["not-found.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NotFound implements OnInit {
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle("Not Found | HoloStats");
  }
}
