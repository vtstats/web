import { Component } from "@angular/core";

@Component({
  selector: "hs-shimmer-stream-list",
  template: `
    <div class="stream-list-container shimmering">
      <div class="date-label">
        <span class="text shimmer"></span>
      </div>

      <div class="stream-list">
        <div class="stream" *ngFor="let x of [1, 2, 3, 4, 5]">
          <div class="thumbnail"></div>

          <div class="title shimmer"></div>

          <div class="viewers">
            <span class="value shimmer text"></span>
          </div>

          <div class="meta">
            <span class="profile shimmer"></span>
            <span class="name shimmer text"> </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ShimmerStreamListComponent {}
