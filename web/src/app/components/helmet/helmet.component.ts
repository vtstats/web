import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "hls-helmet",
  template: "",
})
export class Helmet implements OnChanges {
  @Input() title: string;

  constructor(private _title: Title, private _meta: Meta) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      "title" in changes &&
      changes.title.previousValue !== changes.title.currentValue
    ) {
      if (changes.title.currentValue) {
        this._title.setTitle(`${changes.title.currentValue} | HoloStats`);
      } else {
        this._title.setTitle(`HoloStats`);
      }
    }
  }
}
