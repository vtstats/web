import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  standalone: true,
  selector: "hls-helmet",
  template: "",
})
export class Helmet implements OnChanges {
  private _title = inject(Title);

  @Input("title") title: string;

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
