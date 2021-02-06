import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import type { ApexOptions } from "apexcharts";

@Component({
  selector: "apx-chart",
  template: `<div class="apx-chart" #chart></div>`,
  styleUrls: ["apx-chart.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ApxChart implements OnDestroy {
  @ViewChild("chart", { static: true })
  private chartElement: ElementRef;

  private chartObj: ApexCharts | undefined;

  constructor(private zone: NgZone) {}

  ngOnDestroy() {
    if (this.chartObj) {
      this.chartObj.destroy();
    }
  }

  public createChart(options: ApexOptions) {
    if (this.chartObj) {
      this.chartObj.destroy();
    }

    if ((window as any).ApexCharts) {
      this.chartObj = new ApexCharts(this.chartElement.nativeElement, options);
      this.render();
      return;
    }

    import(
      /* webpackChunkName: "apexcharts" */
      "apexcharts/dist/apexcharts.js"
    ).then(({ default: ApexCharts }) => {
      (window as any).ApexCharts = ApexCharts;
      this.chartObj = new ApexCharts(this.chartElement.nativeElement, options);
      this.render();
    });
  }

  public render(): Promise<void> {
    return this.chartObj.render();
  }

  public updateOptions(
    options: any,
    redrawPaths?: boolean,
    animate?: boolean,
    updateSyncedCharts?: boolean
  ): Promise<void> {
    return this.chartObj.updateOptions(
      options,
      redrawPaths,
      animate,
      updateSyncedCharts
    );
  }

  public zoomX(min: number, max: number) {
    this.chartObj.zoomX(min, max);
  }
}
