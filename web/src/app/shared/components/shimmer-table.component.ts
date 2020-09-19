import { Component } from "@angular/core";

@Component({
  selector: "hs-shimmer-table",
  template: `
    <div class="table-container shimmering">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="profile">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef><div class="profile shimmer"></div></td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <ng-container matColumnDef="text">
          <th mat-header-cell *matHeaderCellDef>
            <div class="shimmer text"></div>
          </th>
          <td mat-cell *matCellDef>
            <div class="shimmer text"></div>
          </td>
          <td mat-footer-cell *matFooterCellDef>
            <div class="shimmer text"></div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
      </table>
    </div>
  `,
})
export class ShimmerTableComponent {
  readonly dataSource = Array(5);

  readonly displayedColumns = [
    "profile",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
    "text",
  ];
}
