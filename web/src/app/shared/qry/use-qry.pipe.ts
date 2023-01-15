import {
  ChangeDetectorRef,
  inject,
  OnDestroy,
  Pipe,
  PipeTransform,
} from "@angular/core";
import {
  InfiniteQueryObserver,
  InfiniteQueryObserverResult,
  QueryKey,
  QueryObserver,
  QueryObserverResult,
} from "@tanstack/query-core";

import { QryService } from "./qry.service";

@Pipe({
  standalone: true,
  pure: false,
  name: "useQry",
})
export class UseQryPipe implements PipeTransform, OnDestroy {
  private qry = inject(QryService);

  private _ref: ChangeDetectorRef | null;
  private _latest: any = null;

  private _sub: () => void | null = null;
  private _obs: QueryObserver | null = null;

  constructor(ref: ChangeDetectorRef) {
    this._ref = ref;
  }

  ngOnDestroy() {
    if (this._sub) {
      this._dispose();
    }
    this._ref = null;
  }

  transform<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey extends QueryKey = QueryKey
  >(
    obs: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ): QueryObserverResult;
  transform<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey extends QueryKey = QueryKey
  >(
    obs: InfiniteQueryObserver<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >
  ): InfiniteQueryObserverResult {
    if (!this._obs) {
      this._subscribe(obs);
      return this._latest;
    }

    if (obs !== this._obs) {
      this._dispose();
      return this.transform(obs) as any;
    }

    return this._latest;
  }

  private _subscribe(obs: QueryObserver): void {
    this._obs = obs;

    const _updateLatestValue = (value: Object) => {
      if (this._obs === obs) {
        this._latest = value;
        this._ref!.markForCheck();
      }
    };

    _updateLatestValue(
      obs.getOptimisticResult(this.qry.client.defaultQueryOptions(obs.options))
    );

    this._sub = obs.subscribe((result) =>
      _updateLatestValue(obs.trackResult(result))
    );
  }

  private _dispose(): void {
    this._sub!();
    this._latest = null;
    this._sub = null;
    this._obs.destroy();
    this._obs = null;
  }
}
