import { animate, style, transition, trigger } from "@angular/animations";
import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { PaidLiveChatMessage, Stream } from "src/app/models";
import { ApiService } from "src/app/shared";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { ScaleLinear, scaleLinear } from "d3-scale";
import { flatRollup, sort, sum, max } from "d3-array";

import { hexToColorName, symbolToCurrency } from "./mapping";
import { isTouchDevice, within } from "src/utils";

const splitAmount = (amount: string): [string, number] => {
  const idx = amount.split("").findIndex((c) => "0" <= c && c <= "9");

  return [
    amount.slice(0, idx).trim(),
    parseFloat(amount.slice(idx).replace(",", "")),
  ];
};

@Component({
  selector: "hls-paid-chat-chart",
  templateUrl: "paid-chat-chart.html",
  styleUrls: ["paid-chat-chart.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("bar", [
      transition(
        ":enter",
        [
          style({ width: "0" }),
          animate(300, style({ width: "{{ width }}px" })),
        ],
        { params: { width: 0 } }
      ),
    ]),
  ],
})
export class PaidLiveChat implements OnInit {
  @Input() stream: Stream;

  popper = {
    idx: -1,
    offset: ({ placement }) => {
      switch (placement) {
        default:
        case "bottom-start":
          return { mainAxis: 16, crossAxis: 16 };
        case "bottom-end":
          return { mainAxis: 16, crossAxis: -16 };
        case "top":
          return { mainAxis: 32 };
      }
    },
    placement: isTouchDevice ? "top" : "bottom-start",
    flip: isTouchDevice ? false : { padding: 32 },
    referenceRect: null,
  };

  @ViewChild("svg")
  svg: ElementRef<HTMLElement>;

  readonly barHeight: number = 21;
  readonly innerPadding: number = 7;

  readonly leftMargin: number = 50;
  readonly rightMargin: number = 30;
  readonly topMargin: number = 30;
  readonly bottomMargin: number = 10;

  sum = 0;
  items: [
    string,
    {
      total: number;
      totalValue: number;
      currency: string;
      currencyCode: string;
      currencySymbol: string;
      items: [
        string,
        {
          name: string;
          total: number;
          totalValue: number;
        }
      ][];
    }
  ][] = [];

  sub: Subscription;

  width: number = 0;
  xScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  yScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);

  constructor(private api: ApiService, private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.width = this.host.nativeElement.getBoundingClientRect().width;

    this.api
      .liveChatHighlight(this.stream.streamId)
      .pipe(
        map((res) =>
          res.paid.map((msg) => {
            const [symbol, value] = splitAmount(msg.amount);
            const [currencyCode, currency] = symbolToCurrency[symbol] || [
              symbol,
              symbol,
            ];

            return {
              ...msg,
              value,
              currency,
              currencyCode,
              currencySymbol: symbol,
            } as PaidLiveChatMessage;
          })
        )
      )
      .subscribe((items) => {
        if (items.length === 0) return;

        this.items = sort(
          flatRollup(
            items,
            (items) => ({
              total: items.length,
              totalValue: sum(items, (msg) => msg.value),
              currency: items[0].currency,
              currencyCode: items[0].currencyCode,
              currencySymbol: items[0].currencySymbol,
              items: sort(
                flatRollup(
                  items,
                  (items) => ({
                    name: hexToColorName[items[0].color],
                    total: items.length,
                    totalValue: sum(items, (item) => item.value),
                  }),
                  (item) => item.color
                ),
                ([_, group]) => group.totalValue
              ),
            }),
            (item) => item.currencyCode
          ),
          ([_, group]) => -group.total,
          ([_, group]) => group.currencyCode.charCodeAt(0)
        );
        this.sum = sum(this.items, (item) => item[1].total);

        this.xScale
          .domain([0, max(this.items, (item) => item[1].total)])
          .range([0, this.width - this.leftMargin - this.rightMargin]);

        this.yScale
          .domain([0, this.items.length]) // n + 1
          .range([
            this.topMargin,
            this.topMargin +
              this.items.length * (this.barHeight + this.innerPadding),
          ]);
      });

    // TODO: switch to resize observer
    this.sub = fromEvent(window, "resize")
      .pipe(
        map(() => this.host.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((w) => {
        this.width = w;
        this.xScale.range([0, this.width - this.leftMargin - this.rightMargin]);
      });
  }

  tryOpenPopper(e: MouseEvent | TouchEvent) {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

    const { x, y } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = clientX - x;
    const offsetY = clientY - y;

    const idx = Math.floor(this.yScale.invert(offsetY));

    if (
      within(idx, 0, this.items.length - 1) &&
      within(offsetX, this.leftMargin, this.width - this.rightMargin)
    ) {
      this.popper.idx = idx;
      this.popper.referenceRect = {
        width: 0,
        height: 0,
        top: clientY,
        right: clientX,
        bottom: clientY,
        left: clientX,
      };
    } else {
      this.closePopper();
    }
  }

  closePopper() {
    this.popper.idx = -1;
  }

  trackBy(idx, item) {
    return item[0];
  }
}
