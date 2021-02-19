import {
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
  ChangeDetectorRef,
} from "@angular/core";
import { format } from "date-fns";

import { ApxChart } from "../apx-chart/apx-chart";

import { ChannelReportKind, Report } from "src/app/models";
import { translate } from "src/i18n";

@Component({
  selector: "hs-channel-stats-chart",
  template: `
    <div class="channel-stats-chart">
      <div class="container">
        <div class="desc">
          <span class="title">
            {{ title }}
          </span>
          <div class="row">
            <span class="number">
              {{ value | number }}
            </span>
            <span class="spacer"></span>
            <span>{{ date }}</span>
          </div>
        </div>
        <div class="chart">
          <apx-chart #chart [height]="120" [marginBottom]="15"></apx-chart>
        </div>
      </div>
      <mat-divider></mat-divider>
    </div>
  `,
  styleUrls: ["channel-stats-chart.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChannelStatsChart implements OnChanges {
  @Input() report: Report<ChannelReportKind>;

  @ViewChild("chart", { static: true })
  private chart: ApxChart;

  constructor(private cdf: ChangeDetectorRef) {}

  private dataPointIndex: number = -1;

  get title(): string {
    return translate(
      {
        [ChannelReportKind.youtubeChannelSubscriber]: "youtubeSubscribers",
        [ChannelReportKind.youtubeChannelView]: "youtubeViews",
        [ChannelReportKind.bilibiliChannelSubscriber]: "bilibiliSubscribers",
        [ChannelReportKind.bilibiliChannelView]: "bilibiliViews",
      }[this.report.kind]
    );
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

  get date(): string {
    let d = this.report.rows[
      this.dataPointIndex === -1
        ? this.report.rows.length - 1
        : this.dataPointIndex
    ][0];
    return format(d, "yyyy-MM-dd HH:mm");
  }

  get value(): number {
    return this.report.rows[
      this.dataPointIndex === -1
        ? this.report.rows.length - 1
        : this.dataPointIndex
    ][1];
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
        toolbar: {
          show: false,
          autoSelected: "pan",
        },
        selection: { enabled: false },
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
  selector: "hs-channel-stats-chart-shimmer",
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
