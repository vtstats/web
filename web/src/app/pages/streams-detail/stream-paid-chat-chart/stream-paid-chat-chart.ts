import { CommonModule, formatCurrency, formatNumber } from "@angular/common";
import { Component, inject, Input, LOCALE_ID, OnInit } from "@angular/core";
import { type EChartsOption } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";

import { LiveChatHighlightResponse, Stream } from "src/app/models";
import { ThemeService } from "src/app/shared/config/theme.service";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { CHAT_CURRENCIES } from "./tokens";

const splitAmount = (amount: string): [string, number] => {
  const idx = amount.split("").findIndex((c) => "0" <= c && c <= "9");

  return [
    amount.slice(0, idx).trim(),
    parseFloat(amount.slice(idx).replace(",", "")),
  ];
};

@Component({
  standalone: true,
  imports: [NgxEchartsModule, CommonModule, CommonModule, UseQryPipe],
  selector: "hls-stream-paid-chat-chart",
  templateUrl: "stream-paid-chat-chart.html",
})
export class StreamPaidChatChart implements OnInit {
  private chatCurrencies = inject(CHAT_CURRENCIES);
  private qry = inject(QryService);
  private locale = inject(LOCALE_ID);
  theme$ = inject(ThemeService).theme$;

  @Input() stream: Stream;

  highlightQry: Qry<
    LiveChatHighlightResponse,
    unknown,
    { options: EChartsOption },
    LiveChatHighlightResponse,
    [string, string]
  >;

  ngOnInit() {
    this.highlightQry = this.qry.create({
      queryKey: ["streams_paid_chat", this.stream.streamId],
      queryFn: ({ queryKey: [_, id] }) =>
        fetch(
          `https://holoapi.poi.cat/api/v4/live_chat/highlight?id=${id}`
        ).then((res) => res.json()),
      select: (res) => this.transformToOptions(res),
    });
  }

  transformToOptions(res: LiveChatHighlightResponse): {
    options: EChartsOption;
    height: number;
  } {
    const dataset = [
      /* currencies */ [],
      /* 1DE9B6FF */ [],
      /* FFCA28FF */ [],
      /* 1E88E5FF */ [],
      /* 00E5FFFF */ [],
      /* F57C00FF */ [],
      /* E91E63FF */ [],
      /* E62117FF */ [],
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

    for (const msg of res.paid) {
      // $100
      const [symbol, value] = splitAmount(msg.amount);
      const [currencyCode, currency] = this.chatCurrencies[symbol] || [
        symbol,
        symbol,
      ];

      // value // 100
      // currency // United States Dollar
      // currencyCode // USD
      // symbol // $

      let x = dataset[0].findIndex((c) => c.code === currencyCode);

      if (x === -1) {
        x = dataset[0].length;
        dataset[0].push({
          index: x,
          code: currencyCode,
          count: 0,
          value: 0,
          name: currency,
          symbol,
        });
      }

      let y =
        {
          "1DE9B6FF": 1,
          FFCA28FF: 2,
          "1E88E5FF": 3,
          "00E5FFFF": 4,
          F57C00FF: 5,
          E91E63FF: 6,
          E62117FF: 7,
        }[msg.color] || -1;

      dataset[0][x].count += 1;
      dataset[0][x].value += value;

      dataset[y][x] ||= { count: 0, value: 0 };
      dataset[y][x].count += 1;
      dataset[y][x].value += value;
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

    const height =
      sorted.length * 45 /* barWidth + barCategoryGap */ + 20; /* grid */

    const options: EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none",
        },
      },
      grid: {
        left: 0,
        right: 16,
        top: 20,
        bottom: 0,
      },
      xAxis: {
        type: "value",
        position: "top",
        splitLine: {
          lineStyle: { type: "dashed" },
        },
        max: "dataMax",
        axisLabel: {
          formatter: (value) =>
            value <= 0 ? "" : formatNumber(value, this.locale),
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

    return { height, options };
  }
}
