import { HttpClient } from "@angular/common/http";
import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "hls-licenses",
  templateUrl: "licenses.html",
  styleUrls: ["licenses.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Licenses {
  constructor(private http: HttpClient) {}
  text$ = this.http.get("/3rdpartylicenses.txt", { responseType: "text" });
}
