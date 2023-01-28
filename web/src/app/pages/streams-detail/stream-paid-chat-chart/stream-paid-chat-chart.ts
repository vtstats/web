import { CommonModule, formatCurrency, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  LOCALE_ID,
  OnChanges,
} from "@angular/core";
import { type EChartsOption } from "echarts";

import { Chart } from "src/app/components/chart/chart";
import { PaidChat } from "src/app/shared/api/entrypoint";
import { UseCurrencyPipe } from "src/app/shared/config/use-currency.pipe";

import { CHAT_CURRENCIES } from "./tokens";

@Component({
  standalone: true,
  imports: [CommonModule, CommonModule, UseCurrencyPipe, Chart],
  selector: "hls-stream-paid-chat-chart",
  templateUrl: "stream-paid-chat-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamPaidChatChart implements OnChanges {
  private chatCurrencies = inject(CHAT_CURRENCIES);
  private locale = inject(LOCALE_ID);

  @Input() chats: PaidChat[];

  options: EChartsOption;
  height: number;
  items: number;

  ngOnChanges() {
    if (!this.chats) {
      return;
    }

    const dataset = [
      /* currencies */ [],
      /* Green */ [],
      /* Yellow */ [],
      /* Blue */ [],
      /* LightBlue */ [],
      /* Orange */ [],
      /* Magenta */ [],
      /* Red */ [],
    ];

    const series: EChartsOption["series"] = [
      ["1DE9B6FF", $localize`:@@green:Green`],
      ["FFCA28FF", $localize`:@@yellow:Yellow`],
      ["1E88E5FF", $localize`:@@blue:Blue`],
      ["00E5FFFF", $localize`:@@lightBlue:Light blue`],
      ["F57C00FF", $localize`:@@orange:Orange`],
      ["E91E63FF", $localize`:@@magenta:Magenta`],
      ["E62117FF", $localize`:@@red:Red`],
    ].map(([color, name]) => ({
      id: color,
      name,
      type: "bar",
      stack: "Total",
      label: { show: false },
      data: [],
      emphasis: { focus: "series" },
      color: "#" + color,
      barCategoryGap: 25,
    }));

    for (const chat of this.chats) {
      let x = dataset[0].findIndex((c) => c.code === chat.code);

      if (x === -1) {
        x = dataset[0].length;

        dataset[0].push({
          index: x,
          code: chat.code,
          count: 0,
          value: 0,
          name: this.chatCurrencies.find((i) => i[0] === chat.code)[1],
          symbol: chat.symbol,
        });
      }

      let y = {
        Green: 1,
        Yellow: 2,
        Blue: 3,
        LightBlue: 4,
        Orange: 5,
        Magenta: 6,
        Red: 7,
      }[chat.color];

      if (y) {
        dataset[0][x].count += 1;
        dataset[0][x].value += chat.value;

        dataset[y][x] ||= { count: 0, value: 0 };
        dataset[y][x].count += 1;
        dataset[y][x].value += chat.value;
      }
    }

    const sorted = dataset[0]
      .sort((a, b) => b.count - a.count)
      .map((i) => i.index);

    for (const i of sorted) {
      (series[0].data as number[]).push(dataset[1][i]?.count || 0);
      (series[1].data as number[]).push(dataset[2][i]?.count || 0);
      (series[2].data as number[]).push(dataset[3][i]?.count || 0);
      (series[3].data as number[]).push(dataset[4][i]?.count || 0);
      (series[4].data as number[]).push(dataset[5][i]?.count || 0);
      (series[5].data as number[]).push(dataset[6][i]?.count || 0);
      (series[6].data as number[]).push(dataset[7][i]?.count || 0);
    }

    this.height =
      /* barWidth + barCategoryGap */ sorted.length * 45 +
      /* label */ 20 +
      /* grid */ 32;

    this.items = this.chats.length;

    this.options = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none",
        },
      },
      grid: {
        left: 16,
        right: 16,
        top: 16,
        bottom: 16,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        position: "top",
        splitLine: {
          lineStyle: { type: "dashed" },
        },
        max: "dataMax",
        axisLabel: {
          formatter: (value) => formatNumber(value, this.locale),
        },
      },
      yAxis: {
        type: "category",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        position: "left",
        z: 100,
        inverse: true,
        axisLabel: {
          verticalAlign: "bottom",
          padding: [0, 0, 12, 0],
          inside: true,
          formatter: (i) => {
            const currency = dataset[0][i];
            return (
              currency.code +
              " - " +
              formatCurrency(
                currency.value,
                this.locale,
                currency.symbol,
                currency.code
              )
            );
          },
        },
        data: sorted,
      },
      series,
    };
  }
}
