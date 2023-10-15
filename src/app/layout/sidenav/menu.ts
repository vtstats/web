import { NgFor, NgIf } from "@angular/common";
import { Component, Input, ViewEncapsulation, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { DrawerService } from "src/app/shared/services/drawer";

@Component({
  standalone: true,
  selector: "vts-sidenav-menu",
  imports: [
    NgIf,
    NgFor,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDividerModule,
  ],
  template: `
    <div
      *ngIf="headline"
      class="text-xs p-4 tracking-wider mat-secondary-text font-medium select-none uppercase"
    >
      {{ headline }}
    </div>
    <a
      *ngFor="let item of items"
      mat-list-item
      [routerLink]="item.link"
      routerLinkActive="router-active mat-color-primary"
      (click)="onClick()"
    >
      <mat-icon color="black" matListItemIcon [svgIcon]="item.icon" />
      <p matListItemTitle>{{ item.title }}</p>
    </a>
  `,
  styleUrls: ["./menu.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavMenu {
  @Input() headline?: string;
  @Input() items: { icon: string; title: string; link: string }[] = [];

  drawerService = inject(DrawerService);

  onClick() {
    if (
      this.drawerService.drawer &&
      this.drawerService.drawer.mode === "over"
    ) {
      this.drawerService.drawer.close();
    }
  }
}
