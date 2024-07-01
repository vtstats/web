import { Component, Input, ViewEncapsulation, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { ResizeService } from "src/app/shared";

@Component({
  standalone: true,
  selector: "vts-sidenav-menu",
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDividerModule,
  ],
  template: `
    @if (headline) {
      <div
        class="text-xs p-4 tracking-wider mat-secondary-text font-medium select-none uppercase"
      >
        {{ headline }}
      </div>
    }
    @for (item of items; track item.link) {
      <a
        mat-list-item
        [routerLink]="item.link"
        routerLinkActive="router-active mat-color-primary"
        (click)="onClick()"
      >
        <mat-icon color="black" matListItemIcon [svgIcon]="item.icon" />
        <p matListItemTitle>{{ item.title }}</p>
      </a>
    }
  `,
  styleUrls: ["./menu.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavMenu {
  @Input() headline?: string;
  @Input() items: { icon: string; title: string; link: string }[] = [];

  resizeService = inject(ResizeService);

  onClick() {
    if (
      this.resizeService.drawer &&
      this.resizeService.drawer.mode === "over"
    ) {
      this.resizeService.drawer.close();
    }
  }
}
