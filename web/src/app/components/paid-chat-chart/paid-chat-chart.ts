import {
  Component,
  Input,
  NgZone,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  ViewChild,
  Inject,
  LOCALE_ID,
} from "@angular/core";
import {
  LiveChatHighlightResponse,
  PaidLiveChatMessage,
  Stream,
} from "src/app/models";
import { ApiService } from "src/app/shared";
import { map } from "rxjs/operators";
import SVG from "svg.js";
import { formatCurrency, formatNumber } from "@angular/common";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { hexToColorName, symbolToCurrency } from "./mapping";
import { PopperComponent } from "../popper/popper";

const splitAmount = (amount: string): [string, number] => {
  const idx = amount.split("").findIndex((c) => "0" <= c && c <= "9");

  return [
    amount.slice(0, idx).trim(),
    parseFloat(amount.slice(idx).replace(",", "")),
  ];
};

const groupByCurrency = (
  res: LiveChatHighlightResponse
): {
  currencyCode: string;
  currency: string;
  total: number;
  symbol: string;
  messages: PaidLiveChatMessage[];
}[] => {
  return res.paid.reduce((acc, msg) => {
    const [symbol, value] = splitAmount(msg.amount);
    const [currencyCode, currency] = symbolToCurrency[symbol] || [
      symbol,
      symbol,
    ];
    const idx = acc.findIndex((i) => i.currencyCode === currencyCode);

    if (idx >= 0) {
      acc[idx].total += value;
      acc[idx].messages.push({ value, ...msg });
    } else {
      acc.push({
        currency,
        currencyCode,
        symbol,
        total: value,
        messages: [{ value, ...msg }],
      });
    }

    return acc;
  }, []);
};

@Component({
  selector: "hs-paid-chat-chart",
  templateUrl: "paid-chat-chart.html",
  styleUrls: ["paid-chat-chart.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PaidLiveChat implements OnInit {
  @Input() stream: Stream;

  @ViewChild("popperComp")
  popperComp: PopperComponent;
  popper = {
    idx: -1,
    currency: "",
    symbol: "",
    total: 0,
    totalValue: 0,
    messagesByColor: [],
  };

  @ViewChild("bars", { static: true })
  private barsEl: ElementRef;
  private barsSvg: SVG.Doc;

  readonly barHeight: number = 21;
  readonly innerPadding: number = 7;

  readonly leftMargin: number = 50;
  readonly rightMargin: number = 30;
  readonly topMargin: number = 30;
  readonly bottomMargin: number = 10;

  items: {
    currency: string;
    currencyCode: string;
    symbol: string;
    total: number;
    messages: PaidLiveChatMessage[];
  }[] = [];

  sub: Subscription;

  constructor(
    private ngZone: NgZone,
    private api: ApiService,
    private host: ElementRef<HTMLElement>,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit() {
    this.api
      .liveChatHighlight(this.stream.streamId)
      .pipe(map(groupByCurrency))
      .subscribe((items) => {
        if (items.length === 0) return;
        this.items = items;
        this.ngZone.runOutsideAngular(() => this._render());
      });

    // TODO: switch to resize observer
    this.sub = fromEvent(window, "resize")
      .pipe(
        map(() => this.host.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((w) => this._render(w));
  }

  _render(width?: number) {
    if (this.barsSvg) {
      this.barsSvg.off("mousemove");
      this.barsSvg.off("mouseleave");
      this.barsSvg.clear();
    } else {
      this.barsSvg = SVG(this.barsEl.nativeElement);
    }

    if (!width) {
      width = this.host.nativeElement.getBoundingClientRect().width;
    }

    const height =
      this.topMargin +
      this.items.length * (this.innerPadding + this.barHeight) +
      this.bottomMargin;

    this.barsSvg.size(width, height);

    const max = Math.max(...this.items.map((i) => i.messages.length));

    const scale = (width - this.leftMargin - this.rightMargin) / max;

    const sorted = this.items.sort(
      (a, b) => b.messages.length - a.messages.length
    );

    this.popperComp.update();

    this.barsSvg
      .line([
        this.leftMargin,
        this.topMargin - this.innerPadding,
        this.leftMargin,
        this.topMargin +
          this.items.length * (this.innerPadding + this.barHeight),
      ])
      .addClass("line")
      .stroke({ width: 1 });

    let unit = Math.max(1, Math.floor(max / 5));

    if (max >= 1000) {
      unit -= unit % 100;
    } else if (max >= 100) {
      unit -= unit % 10;
    }

    for (let i = 1; i <= 6; i++) {
      const v = i * unit;

      if (v > max) break;

      const x = this.leftMargin + v * scale;

      this.barsSvg
        .line([
          x,
          this.topMargin - this.innerPadding,
          x,
          this.topMargin +
            this.items.length * (this.innerPadding + this.barHeight),
        ])
        .addClass("line")
        .stroke({ width: 1 });

      this.barsSvg
        .text(formatNumber(v, this.locale))
        .addClass("label")
        .move(x, 0)
        .font({ anchor: "middle", family: "Fira Code" });
    }

    for (const [idx, item] of sorted.entries()) {
      this.barsSvg
        .plain(item.currencyCode)
        .addClass("label")
        .font({
          size: "14",
          weight: "500",
          family: "Fira Code, sans-serif",
          anchor: "end",
        })
        .dx(this.leftMargin - this.innerPadding)
        .cy(
          this.topMargin +
            (this.barHeight + this.innerPadding) * idx +
            this.barHeight / 2
        );

      this.barsSvg
        .rect(0, this.barHeight)
        .attr({ idx })
        .move(
          this.leftMargin,
          this.topMargin + (this.barHeight + this.innerPadding) * idx
        )
        .radius(2, 2)
        .fill("#d81b60")
        .animate(300)
        .attr("width", item.messages.length * scale);

      const inverse = item.messages.length * scale >= width / 2;

      this.barsSvg
        .plain(
          formatCurrency(
            item.total,
            this.locale,
            // currency
            item.symbol,
            // currency code
            item.currency
          )
        )
        .addClass(inverse ? "point-inverse" : "point")
        .attr({ idx })
        .font({
          size: "14",
          weight: "500",
          family: "Fira Code, sans-serif",
          anchor: inverse ? "end" : "start",
        })
        .dx(this.leftMargin)
        .cy(
          this.topMargin +
            (this.barHeight + this.innerPadding) * idx +
            this.barHeight / 2
        )
        .animate(300)
        .attr(
          "dx",
          item.messages.length * scale + this.innerPadding * (inverse ? -1 : 1)
        );
    }

    this.barsSvg.on("mousemove", this._handleMousemove, this);
    this.barsSvg.on("mouseleave", this._handleMouseleave, this);
  }

  _handleMousemove(e: MouseEvent) {
    if (e.target instanceof Element && e.target.hasAttribute("idx")) {
      const idx = Number(e.target.getAttribute("idx"));

      if (idx !== this.popper.idx) {
        this.ngZone.run(() => {
          const { currency, symbol, messages, total } = this.items[idx];
          this.popper.currency = currency;
          this.popper.symbol = symbol;
          this.popper.total = messages.length;
          this.popper.totalValue = total;
          this.popper.messagesByColor = messages.reduce((acc, cur: any) => {
            const idx = acc.findIndex((i) => i.color === cur.color);

            if (idx >= 0) {
              acc[idx].total += 1;
              acc[idx].totalValue += cur.value;
            } else {
              acc.push({
                currency: cur.currency,
                symbol: cur.symbol,
                color: cur.color,
                cate: hexToColorName[cur.color],
                total: 1,
                totalValue: cur.value,
              });
            }

            return acc;
          }, []);
          this.popper.messagesByColor.sort(
            (a, b) => a.totalValue - b.totalValue
          );
        });
      }

      this.popperComp.update({
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX,
        }),
      } as Element);
    } else {
      this.popperComp.hide();
    }
  }

  _handleMouseleave() {
    this.popperComp.hide();
  }
}
