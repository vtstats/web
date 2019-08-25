import { Component } from "@angular/core";

import { ApiService } from "./services";

@Component({
  selector: "hs-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  isLoading;

  constructor(private apiService: ApiService) {
    this.apiService.isLoading$.subscribe(
      isLoading => (this.isLoading = isLoading)
    );
  }
}
