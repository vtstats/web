import { CommonModule } from "@angular/common";
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { EChartsOption } from "echarts";
import { type ECharts } from "echarts/core";
import {
  BehaviorSubject,
  debounceTime,
  fromEvent,
  shareReplay,
  Subject,
  takeUntil,
} from "rxjs";
import { ThemeService } from "src/app/shared/config/theme.service";

const windowResize$ = fromEvent(window, "resize").pipe(
  debounceTime(250),
  shareReplay(1)
);

@Component({
  selector: "hls-chart",
  standalone: true,
  imports: [CommonModule],
  template: `<div
    #container
    class="w-full"
    [ngClass]="(loading$ | async) && 'shimmer rounded animate-pulse'"
    [style.height.px]="_height"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chart
  implements AfterContentInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild("container", { static: true, read: ElementRef })
  container: ElementRef<HTMLDivElement>;

  private theme = inject(ThemeService);
  private ngZone = inject(NgZone);

  chart: ECharts;

  option$ = new BehaviorSubject<EChartsOption | null>(null);

  @Input() set options(opts: EChartsOption) {
    this.option$.next(opts);
  }

  _height = 400;

  @Input() set height(h: number) {
    this._height = h;
  }

  loading$ = new BehaviorSubject<boolean>(false);

  @Input() set loading(l: boolean) {
    this.loading$.next(l);
  }

  @Output() chartInit = new EventEmitter<ECharts>();

  destroy$ = new Subject<boolean>();

  ngAfterViewInit() {}

  async ngAfterContentInit() {
    this.loading$.next(true);

    const { init } = await import(
      /* webpackChunkName: "echarts" */ "./echarts"
    );

    this.loading$.next(false);

    this.theme.theme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      if (this.chart) {
        this._dispose();
      }

      this.chart = this.ngZone.runOutsideAngular(() => {
        return init(this.container.nativeElement, theme, {
          height: this._height,
        });
      });
      this.chartInit.emit(this.chart);
      const option = this.option$.getValue();
      if (option) this.chart.setOption(option);
    });

    windowResize$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.chart) {
        this.chart.resize();
      }
    });

    this.option$.pipe(takeUntil(this.destroy$)).subscribe((option) => {
      if (this.chart && option) {
        this.chart.setOption(option);
      }
    });
  }

  _dispose() {
    this.chart.dispose();
    this.chart = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("height" in changes && this.chart) {
      this.chart.resize({ height: this._height });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.chart) {
      this._dispose();
    }
  }
}
