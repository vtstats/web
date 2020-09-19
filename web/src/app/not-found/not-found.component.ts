import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "hs-not-found",
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle("Not Found | HoloStats");
  }
}
