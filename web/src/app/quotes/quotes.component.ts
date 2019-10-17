import { Component } from "@angular/core";

@Component({
  selector: "hs-quotes",
  templateUrl: "./quotes.component.html",
  styleUrls: ["./quotes.component.scss"]
})
export class QuotesComponent {
  readonly quotes = ["阿火", "yagoo落泪"];

  encodeURI(s: string): string {
    return encodeURI(s);
  }
}
