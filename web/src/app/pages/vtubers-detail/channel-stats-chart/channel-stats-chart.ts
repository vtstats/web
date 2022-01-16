import {
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
  ChangeDetectorRef,
} from "@angular/core";

import { ApxChart } from "../apx-chart/apx-chart";

import { ChannelReportKind, Report } from "src/app/models";

@Component({
  selector: "hls-channel-stats-chart",
  templateUrl: "channel-stats-chart.html",
  styleUrls: ["channel-stats-chart.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChannelStatsChart implements OnChanges {
  @Input() report: Report<ChannelReportKind>;

  @ViewChild("chart", { static: true })
  private chart: ApxChart;

  constructor(private cdf: ChangeDetectorRef) {}

  private dataPointIndex: number = null;

  get title(): string {
    return {
      [ChannelReportKind.youtubeChannelSubscriber]: $localize`:@@youtubeSubscribers:`,
      [ChannelReportKind.youtubeChannelView]: $localize`:@@youtubeViews:`,
      [ChannelReportKind.bilibiliChannelSubscriber]: $localize`:@@bilibiliSubscribers:`,
      [ChannelReportKind.bilibiliChannelView]: $localize`:@@bilibiliViews:`,
    }[this.report.kind];
  }

  get colors(): string[] {
    switch (this.report.kind) {
      case ChannelReportKind.youtubeChannelSubscriber:
      case ChannelReportKind.youtubeChannelView:
        return ["#e00404"];
      case ChannelReportKind.bilibiliChannelSubscriber:
      case ChannelReportKind.bilibiliChannelView:
        return ["#00a1d6"];
    }
  }

  get dataPoint(): [number, number] | null {
    return (
      this.report.rows[this.dataPointIndex] ||
      this.report.rows[this.report.rows.length - 1]
    );
  }

  resetDataPointIndex() {
    this.dataPointIndex = null;
    this.cdf.markForCheck();
  }

  ngOnChanges() {
    this.chart.createChart({
      series: [{ data: this.report.rows }],
      stroke: { width: 3 },
      tooltip: {
        custom: () => "",
      },
      xaxis: {
        type: "datetime",
        floating: true,
        labels: { show: false },
        tooltip: { enabled: false },
        axisTicks: { show: false },
      },
      yaxis: {
        floating: true,
        axisTicks: { show: false },
        labels: { show: false },
      },
      markers: { size: 0 },
      dataLabels: { enabled: false },
      chart: {
        id: this.report.kind,
        type: "area",
        height: 120,
        toolbar: { show: false },
        zoom: { enabled: false },
        events: {
          mouseMove: (_a, _b, config) => {
            this.dataPointIndex = config.dataPointIndex;
            this.cdf.markForCheck();
          },
        },
      },
      grid: {
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: true } },
        padding: {
          left: -20,
          right: 0,
          bottom: 0,
          top: -20,
        },
      },
      colors: this.colors,
      responsive: [
        {
          breakpoint: 600,
          options: { chart: { height: 80 } },
        },
      ],
    });
  }
}

@Component({
  selector: "hls-channel-stats-chart-shimmer",
  template: `
    <div class="channel-stats-chart">
      <div class="container">
        <div class="desc">
          <span class="title text shimmer" [style.width.px]="150"></span>
          <div class="row">
            <span class="number text shimmer" [style.width.px]="100"></span>
            <span class="spacer"></span>
            <span class="text shimmer" [style.width.px]="130"></span>
          </div>
        </div>
        <div
          class="chart shimmer"
          [style.height.px]="120"
          [style.marginBottom.px]="15"
        ></div>
      </div>
      <mat-divider></mat-divider>
    </div>
  `,
  styleUrls: ["channel-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelStatsChartShimmer {}
