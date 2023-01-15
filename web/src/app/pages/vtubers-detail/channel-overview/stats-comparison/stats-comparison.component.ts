import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ChannelReportKind } from "src/app/models";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "hls-stats-comparison",
  templateUrl: "./stats-comparison.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComparisonComponent {
  @Input() rows: [number, number][] = [];
  @Input() kind: ChannelReportKind;

  get title(): string {
    switch (this.kind) {
      case ChannelReportKind.youtubeChannelSubscriber: {
        return $localize`:@@youtubeSubscribers:YouTube Subscribers`;
      }

      case ChannelReportKind.youtubeChannelView: {
        return $localize`:@@youtubeViews:YouTube Views`;
      }

      case ChannelReportKind.bilibiliChannelSubscriber: {
        return $localize`:@@bilibiliSubscribers:Bilibili Subscribers`;
      }

      case ChannelReportKind.bilibiliChannelView: {
        return $localize`:@@bilibiliViews:Bilibili Views`;
      }
    }
  }

  get delta(): number {
    const head = this.rows[0]?.[1];
    const tail = this.rows[this.rows.length - 1]?.[1];

    return tail - head;
  }
}
